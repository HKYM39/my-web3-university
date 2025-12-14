// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Minimal AAVE-like pool mock to track supply/withdraw.
contract MockAavePool {
    mapping(address => mapping(address => uint256)) public supplied; // user => asset => amount

    event Supplied(address indexed asset, address indexed onBehalfOf, uint256 amount);
    event Withdrawn(address indexed asset, address indexed user, uint256 amount);

    function supply(address asset, uint256 amount, address onBehalfOf, uint16) external {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        supplied[msg.sender][asset] += amount;
        emit Supplied(asset, onBehalfOf, amount);
    }

    function withdraw(address asset, uint256 amount, address to) external returns (uint256) {
        uint256 balance = supplied[msg.sender][asset];
        uint256 toWithdraw = amount > balance ? balance : amount;
        supplied[msg.sender][asset] = balance - toWithdraw;
        IERC20(asset).transfer(to, toWithdraw);
        emit Withdrawn(asset, msg.sender, toWithdraw);
        return toWithdraw;
    }
}
