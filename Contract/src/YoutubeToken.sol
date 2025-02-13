// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YoutubeToken is ERC20, Ownable {
    uint256 public royaltyFee;
    address public royaltyRecipient;

    event RoyaltyFeeSet(uint256 fee);
    event RoyaltyRecipientSet(address recipient);
    event Burn(address indexed from, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _royaltyFee,
        address _creator,
        address marketplace
    ) ERC20(name, symbol) Ownable(_creator) {
        require(initialSupply > 0, "Invalid initial supply");
        require(_creator != address(0), "Invalid creator address");
        require(_royaltyFee >= 0 && _royaltyFee <= 10, "Royalty cannot exceed 10%");

        _mint(_creator, initialSupply);
        royaltyFee = _royaltyFee;
        royaltyRecipient = _creator;
        _approve(_creator, marketplace, initialSupply);
    }

    function setRoyaltyFee(uint256 _royaltyFee) external onlyOwner {
        require(_royaltyFee >= 0 && _royaltyFee <= 10, "Royalty cannot exceed 10%");
        royaltyFee = _royaltyFee;
        emit RoyaltyFeeSet(_royaltyFee);
    }

    function setRoyaltyRecipient(address _royaltyRecipient) external onlyOwner {
        require(_royaltyRecipient != address(0), "Invalid royalty recipient address");
        royaltyRecipient = _royaltyRecipient;
        emit RoyaltyRecipientSet(_royaltyRecipient);
    }

    function getRoyaltyRecipient() external view returns (address) {
        return royaltyRecipient;
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }
    
}
