// // import { MetaMaskInpageProvider } from '@metamask/providers';
// import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

// declare global {
//   interface Window {
//     // ethereum: MetaMaskInpageProvider;
//     solana: PhantomWalletAdapter;
//   }
// }

interface Window {
  solana: any
}
declare var window: Window