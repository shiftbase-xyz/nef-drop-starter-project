import {
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
  safeFetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine';
import type {
  CandyGuard as CandyGuardType,
  CandyMachine as CandyMachineType,
  StartDate as StartDateType,
} from '@metaplex-foundation/mpl-candy-machine';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import {
  generateSigner,
  Option,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import type { Umi as UmiType } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { nftStorageUploader } from '@metaplex-foundation/umi-uploader-nft-storage';
import { useEffect, useState } from 'react';

import candyMachineStyles from './CandyMachine.module.css';

import CountdownTimer from '@/components/CountdownTimer';
import styles from '@/styles/Home.module.css';

const ManageNFTAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

type CandyMachineProps = {
  walletAddress: any;
};

const CandyMachine = (props: CandyMachineProps) => {
  const { walletAddress } = props;
  const [umi, setUmi] = useState<UmiType | undefined>(undefined);
  const [candyMachine, setCandyMachine] = useState<
    CandyMachineType | undefined
  >(undefined);
  const [candyGuard, setCandyGuard] = useState<CandyGuardType | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const renderDropTimer = () => {
    if (candyGuard?.guards.startDate === undefined) {
      return;
    }

    const startDate: Option<StartDateType> = candyGuard.guards.startDate;
    if (startDate.__option === 'None') {
      return;
    }
    const currentDate = new Date();
    const dropDate = new Date(Number(startDate.value.date) * 1000);

    // If the current date is before the drop date, render the countdown component
    if (currentDate < dropDate) {
      console.log('Before drop date!');
      return <CountdownTimer dropDate={dropDate} />;
    }

    // If the current date is after the drop date, render the drop date
    return <p>{`Drop Date: ${dropDate}`}</p>;
  };

  const getCandyMachineState = async () => {
    try {
      // Use the RPC endpoint of your choice.
      if (
        process.env.NEXT_PUBLIC_SOLANA_RPC_HOST &&
        process.env.NEXT_PUBLIC_CANDY_MACHINE_ID
      ) {
        const umi = createUmi(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST)
          .use(walletAdapterIdentity(walletAddress))
          .use(nftStorageUploader())
          .use(mplTokenMetadata())
          .use(mplCandyMachine());
        const candyMachine = await fetchCandyMachine(
          umi,
          publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID),
        );
        // Check
        console.log(
          `candyMachine.mintAuthority: ${JSON.stringify(
            candyMachine.mintAuthority,
          )}`,
        );
        console.log(
          `candyMachine.publicKey: ${candyMachine.publicKey.toString()}`,
        );
        console.log(
          `candyMachine.items: ${JSON.stringify(candyMachine.items)}`,
        );
        console.log(
          `candyMachine.data.itemsAvailable: ${candyMachine.data.itemsAvailable}`,
        );
        console.log(
          `candyMachine.itemsRedeemed: ${candyMachine.itemsRedeemed}`,
        );

        const candyGuard = await safeFetchCandyGuard(
          umi,
          candyMachine.mintAuthority,
        );

        setUmi(umi);
        setCandyMachine(candyMachine);
        setCandyGuard(candyGuard);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const mintToken = async () => {
    try {
      if (umi === undefined) {
        throw new Error('Umi context was not initialized.');
      }
      if (candyMachine === undefined) {
        throw new Error('Candy Machine was not initialized.');
      }
      const nftSigner = generateSigner(umi);
      await transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 600_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            candyGuard: candyGuard?.publicKey,
            nftMint: nftSigner,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
          }),
        )
        .sendAndConfirm(umi);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCandyMachineState();
  }, []);

  return (
    candyMachine && (
      <div className={candyMachineStyles.machineContainer}>
        {renderDropTimer()}
        <p>
          {' '}
          {`Items Minted: ${candyMachine.itemsRedeemed} / ${candyMachine.data.itemsAvailable}`}
        </p>
        {candyMachine.itemsRedeemed === candyMachine.data.itemsAvailable ? (
          <p className={styles.subText}>Sold Out 🙊</p>
        ) : (
          <button
            className={`${styles.ctaButton} ${styles.mintButton}`}
            onClick={mintToken}
            disabled={isMinting}
          >
            Mint NFT
          </button>
        )}
      </div>
    )
  );
};

export default CandyMachine;
