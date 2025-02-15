/*
  Warnings:

  - A unique constraint covering the columns `[tokenAddress,sellerWalletAddress]` on the table `ListedToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ListedToken_tokenAddress_sellerWalletAddress_key" ON "ListedToken"("tokenAddress", "sellerWalletAddress");
