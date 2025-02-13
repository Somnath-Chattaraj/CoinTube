// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./YoutubeToken.sol"; // ✅ Import YouTubeToken.sol

contract YouTubeMarketplace is Ownable {
    struct Listing {
        address seller;
        uint256 priceInETH; // ✅ Price per token (in ETH)
        uint256 amount;
    }

    mapping(address => mapping(address => Listing)) public listings; // tokenAddress → seller → Listing

    event TokenListed(address indexed token, address indexed seller, uint256 priceInETH, uint256 amount);
    event TokenSold(address indexed token, address indexed buyer, address indexed seller, uint256 amount, uint256 priceInETH);
    event TokenDelisted(address indexed token, address indexed seller);

    constructor() Ownable(msg.sender) {} // ✅ Assign deployer as contract owner

    /**
     * @dev Lists a YouTube token for sale with price in ETH.
     * @param token Address of the token to list.
     * @param priceInETH Price per token (in ETH).
     * @param amount Number of tokens to sell.
     */
    function listTokenForSale(address token, uint256 priceInETH, uint256 amount) external {
        require(priceInETH > 0, "Price must be greater than zero");
        require(amount > 0, "Amount must be greater than zero");
        require(IERC20(token).balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Ensure approval exists for this contract
        require(IERC20(token).allowance(msg.sender, address(this)) >= amount, "Marketplace not approved");

        listings[token][msg.sender] = Listing(msg.sender, priceInETH, amount);

        emit TokenListed(token, msg.sender, priceInETH, amount);
    }

    /**
     * @dev Allows a buyer to purchase a token listing in ETH.
     * @param token Address of the token.
     * @param seller Address of the seller.
     * @param amount Number of tokens to buy.
     */
    function buyToken(address token, address seller, uint256 amount) external payable {
        Listing storage listing = listings[token][seller];
        require(listing.seller == seller, "Listing does not exist");
        require(listing.amount >= amount, "Not enough tokens available");

        uint256 totalPrice = listing.priceInETH * amount; // ✅ Total price in ETH
        require(msg.value >= totalPrice * 1 ether, "Incorrect ETH amount"); // Convert ETH to WEI

        // ✅ Cast token to YoutubeToken
        YoutubeToken ytToken = YoutubeToken(token);

        // ✅ Calculate royalty fee (in ETH)
        uint256 royaltyAmount = (totalPrice * ytToken.royaltyFee()) / 100;
        uint256 sellerAmount = totalPrice - royaltyAmount;

        // ✅ Transfer royalty to the original creator
        payable(ytToken.getRoyaltyRecipient()).transfer(royaltyAmount * 1 ether); // Convert to WEI

        // ✅ Transfer funds to the seller
        payable(seller).transfer(sellerAmount * 1 ether); // Convert to WEI

        // ✅ Transfer the tokens from seller to buyer
        require(IERC20(token).transferFrom(seller, msg.sender, amount), "Token transfer failed");

        // ✅ Update listing amount
        listing.amount -= amount;

        // ✅ Remove listing if all tokens are sold
        if (listing.amount == 0) {
            delete listings[token][seller];
            emit TokenDelisted(token, seller);
        }

        emit TokenSold(token, msg.sender, seller, amount, listing.priceInETH);
    }

    /**
     * @dev Returns the total price for a given token listing in ETH.
     * @param seller Address of the seller.
     * @param token Address of the token.
     * @param amount Number of tokens.
     * @return uint256 Total price in ETH.
     */
    function getRate(address seller, address token, uint256 amount) public view returns (uint256) {
        Listing storage listing = listings[token][seller];
        require(listing.amount >= amount, "Amount exceeds available listing");
        return listing.priceInETH * amount;
    }

    /**
     * @dev Returns the price per token for a specific listing in ETH.
     * @param seller Address of the seller.
     * @param token Address of the token.
     * @return uint256 Price per token in ETH.
     */
    function getListingPrice(address seller, address token) public view returns (uint256) {
        Listing storage listing = listings[token][seller];
        require(listing.seller == seller, "Listing does not exist");
        return listing.priceInETH;
    }

    /**
     * @dev Removes a token listing.
     * @param token Address of the token to delist.
     */
    function delistToken(address token) external {
        require(listings[token][msg.sender].amount > 0, "No active listing found");
        delete listings[token][msg.sender];
        emit TokenDelisted(token, msg.sender);
    }

    /**
     * @dev Fetches the balance of multiple tokens for a user.
     * @param user Address of the user.
     * @param tokens List of token addresses.
     * @return uint256[] Array of balances.
     */
    function getUserTokens(address user, address[] memory tokens) public view returns (uint256[] memory) {
        uint256[] memory balances = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i++) {
            balances[i] = IERC20(tokens[i]).balanceOf(user);
        }
        return balances;
    }
}
