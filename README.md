# Solana NFT Drop Completed

![](https://i.imgur.com/2vEkSJ2.png)

## 実行方法

### 1. 本リポジトリのクローン

```bash
git clone -b complete git@github.com:unchain-tech/Solana-NFT-Drop.git
```

### 2. パッケージのインストール

```bash
yarn install
```

### 3. Candy Machine の構築

[Solana-NFT-Drop / Session 2](https://app.unchain.tech/learn/Solana-NFT-Drop/ja/2/1/)を参考に、環境構築・Candy Machine の構築を行います。

### 4. .env.local ファイルの作成

.env.example ファイルを複製します。

```
cp .env.example .env.local
```

cache.json ファイル(3. Candy Machine の構築で生成)に記載されている`"candyMachine":`の値を、`NEXT_PUBLIC_CANDY_MACHINE_ID=`に設定します。

例）

```bash
# .env.local
NEXT_PUBLIC_CANDY_MACHINE_ID=ChrS4NNbMyQqmx32MmipKyMu7jh8MvSJJCFp3Y3BTavn
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_HOST=https://explorer-api.devnet.solana.com
```

### 5. 開発サーバーの起動

```bash
yarn dev
```

ターミナル上に表示された URL にアクセスしましょう。
