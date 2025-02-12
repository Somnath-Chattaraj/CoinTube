// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RoyaltyDistributor is Ownable(msg.sender) {
    mapping(address => uint256) public royalties;  // Creator => Balance
    event RoyaltyDeposited(address indexed creator, uint256 amount);
    event RoyaltyClaimed(address indexed creator, uint256 amount);

    function depositRoyalty(address _creator) external payable {
        require(msg.value > 0, "Must send ETH");
        royalties[_creator] += msg.value;
        emit RoyaltyDeposited(_creator, msg.value);
    }

    function claimRoyalty() external {
        uint256 amount = royalties[msg.sender];
        require(amount > 0, "No royalty available");

        royalties[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        
        emit RoyaltyClaimed(msg.sender, amount);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
