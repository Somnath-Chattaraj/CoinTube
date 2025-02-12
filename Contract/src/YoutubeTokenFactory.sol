// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./YoutubeToken.sol";

contract YouTubeTokenFactory {
    mapping(address => address[]) public creatorTokens;
    address[] public allTokens;

    address public marketplace; // ✅ Marketplace contract address

    event TokenCreated(address indexed creator, address tokenAddress);
    event MarketplaceUpdated(address newMarketplace);
    event ApprovalGranted(address indexed creator, address indexed token, address spender, uint256 amount);

    constructor(address _marketplace) {
        marketplace = _marketplace; // ✅ Set marketplace on deployment
    }

    function setMarketplace(address _marketplace) external {
        marketplace = _marketplace;
        emit MarketplaceUpdated(_marketplace);
    }

    function createYouTubeToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 royaltyFee
    ) public {
        YoutubeToken token = new YoutubeToken(name, symbol, initialSupply, royaltyFee, msg.sender, marketplace);
        creatorTokens[msg.sender].push(address(token));
        allTokens.push(address(token));
        IERC20(address(token)).approve(marketplace, type(uint256).max);

        emit TokenCreated(msg.sender, address(token));
    }
    function getAllTokens() public view returns (address[] memory) {
        return allTokens;
    }

    function getCreatorTokens(address creator) public view returns (address[] memory) {
        return creatorTokens[creator];
    }

    function getAllowances(
        address owner,
        address spender,
        address[] memory tokens
    ) public view returns (uint256[] memory) {
        uint256[] memory allowances = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i++) {
            allowances[i] = IERC20(tokens[i]).allowance(owner, spender);
        }
        return allowances;
    }

}
