// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChannelCoin is ERC20, Ownable(msg.sender) {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18; // 1M tokens

    address public creator;  // YouTube channel owner
    uint256 public royaltyFee = 5; // 5% trading royalty
    address public royaltyContract; // Address of RoyaltyDistributor

    event RoyaltyUpdated(uint256 newFee);
    event RoyaltyContractUpdated(address newRoyaltyContract);

    constructor(string memory name, string memory symbol, address _creator) ERC20(name, symbol) {
        creator = _creator;
        _mint(creator, INITIAL_SUPPLY); // Mint to creator
    }

    function setRoyaltyFee(uint256 _fee) external onlyOwner {
        require(_fee <= 10, "Royalty cannot exceed 10%");
        royaltyFee = _fee;
        emit RoyaltyUpdated(_fee);
    }

    function setRoyaltyContract(address _contract) external onlyOwner {
        royaltyContract = _contract;
        emit RoyaltyContractUpdated(_contract);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 fee = (amount * royaltyFee) / 100;
        uint256 amountAfterFee = amount - fee;

        super.transfer(royaltyContract, fee);  // Send fee to royalty contract
        super.transfer(recipient, amountAfterFee);

        return true;
    }
}
