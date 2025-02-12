// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChannelDex is Ownable(msg.sender) {
    struct LiquidityPool {
        IERC20 token;
        uint256 ethReserve;
        
        uint256 tokenReserve;
    }

    mapping(address => LiquidityPool) public pools;

    event LiquidityAdded(address indexed token, uint256 ethAmount, uint256 tokenAmount);
    event Swap(address indexed token, address indexed user, uint256 ethAmount, uint256 tokenAmount);
    
    function createPool(address _token) external onlyOwner {
        require(address(pools[_token].token) == address(0), "Pool already exists");
        pools[_token] = LiquidityPool({
            token: IERC20(_token),
            ethReserve: 0,
            tokenReserve: 0
        });
    }

    function addLiquidity(address _token, uint256 _tokenAmount) external payable {
        LiquidityPool storage pool = pools[_token];
        require(address(pool.token) != address(0), "Pool does not exist");

        pool.token.transferFrom(msg.sender, address(this), _tokenAmount);
        pool.ethReserve += msg.value;
        pool.tokenReserve += _tokenAmount;

        emit LiquidityAdded(_token, msg.value, _tokenAmount);
    }

    function swapETHForTokens(address _token) external payable {
        LiquidityPool storage pool = pools[_token];
        require(address(pool.token) != address(0), "Pool does not exist");

        uint256 tokenAmount = (msg.value * pool.tokenReserve) / pool.ethReserve;
        require(tokenAmount > 0, "Insufficient liquidity");

        pool.ethReserve += msg.value;
        pool.tokenReserve -= tokenAmount;
        pool.token.transfer(msg.sender, tokenAmount);

        emit Swap(_token, msg.sender, msg.value, tokenAmount);
    }

    function swapTokensForETH(address _token, uint256 _tokenAmount) external {
        LiquidityPool storage pool = pools[_token];
        require(address(pool.token) != address(0), "Pool does not exist");

        uint256 ethAmount = (_tokenAmount * pool.ethReserve) / pool.tokenReserve;
        require(ethAmount > 0, "Insufficient liquidity");

        pool.token.transferFrom(msg.sender, address(this), _tokenAmount);
        pool.ethReserve -= ethAmount;
        pool.tokenReserve += _tokenAmount;

        payable(msg.sender).transfer(ethAmount);

        emit Swap(_token, msg.sender, ethAmount, _tokenAmount);
    }
}
