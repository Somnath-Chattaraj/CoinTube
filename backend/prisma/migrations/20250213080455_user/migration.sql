-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "creatorAddress" TEXT NOT NULL,
    "royaltyRecipientAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletToken" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "buyerWalletAddress" TEXT NOT NULL,
    "sellerWalletAddress" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListedToken" (
    "id" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "sellerWalletAddress" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListedToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_walletAddress_key" ON "Wallet"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Token_tokenAddress_key" ON "Token"("tokenAddress");

-- CreateIndex
CREATE UNIQUE INDEX "WalletToken_walletAddress_tokenAddress_key" ON "WalletToken"("walletAddress", "tokenAddress");

-- CreateIndex
CREATE INDEX "Transaction_tokenAddress_idx" ON "Transaction"("tokenAddress");

-- CreateIndex
CREATE INDEX "Transaction_buyerWalletAddress_idx" ON "Transaction"("buyerWalletAddress");

-- CreateIndex
CREATE INDEX "Transaction_sellerWalletAddress_idx" ON "Transaction"("sellerWalletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "ListedToken_tokenAddress_sellerWalletAddress_key" ON "ListedToken"("tokenAddress", "sellerWalletAddress");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletToken" ADD CONSTRAINT "WalletToken_walletAddress_fkey" FOREIGN KEY ("walletAddress") REFERENCES "Wallet"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletToken" ADD CONSTRAINT "WalletToken_tokenAddress_fkey" FOREIGN KEY ("tokenAddress") REFERENCES "Token"("tokenAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_tokenAddress_fkey" FOREIGN KEY ("tokenAddress") REFERENCES "Token"("tokenAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyerWalletAddress_fkey" FOREIGN KEY ("buyerWalletAddress") REFERENCES "Wallet"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sellerWalletAddress_fkey" FOREIGN KEY ("sellerWalletAddress") REFERENCES "Wallet"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListedToken" ADD CONSTRAINT "ListedToken_tokenAddress_fkey" FOREIGN KEY ("tokenAddress") REFERENCES "Token"("tokenAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListedToken" ADD CONSTRAINT "ListedToken_sellerWalletAddress_fkey" FOREIGN KEY ("sellerWalletAddress") REFERENCES "Wallet"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
