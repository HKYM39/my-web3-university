// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from '@openzeppelin/contracts/access/AccessControl.sol';
import {
    ReentrancyGuard
} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {
    SafeERC20
} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

/// @notice Minimal AAVE V3 pool interface required for adapter scaffolding.
interface IAavePool {
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;
    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);
}

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256) external;
    function approve(address spender, uint256 amount) external returns (bool);
}

/// @title AAVEAdapter
/// @notice Handles staking creator revenue into AAVE (PRD 4.5).
contract AAVEAdapter is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant STAKING_OPERATOR_ROLE =
        keccak256('STAKING_OPERATOR_ROLE');

    IAavePool public immutable aavePool;
    address public immutable aaveWETH;

    struct Position {
        uint256 supplied; // principal supplied
        uint256 rewardIndex; // placeholder for yield tracking (SC-AA-004)
    }

    /// @dev author => token => Position
    mapping(address => mapping(address => Position)) public positions;

    event Supplied(
        address indexed author,
        address indexed token,
        uint256 amount
    );
    event Withdrawn(
        address indexed author,
        address indexed token,
        uint256 amount,
        uint256 withdrawn
    );

    /// @dev Accept ETH from WETH unwraps during withdraw.
    receive() external payable {}

    constructor(IAavePool pool, address weth) {
        aavePool = pool;
        aaveWETH = weth;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(STAKING_OPERATOR_ROLE, msg.sender);
    }

    /// @notice Supply native ETH on behalf of the author (SC-AA-001/002/005).
    function supplyETH(
        address author
    ) external payable nonReentrant onlyRole(STAKING_OPERATOR_ROLE) {
        require(author != address(0), 'author required');
        require(msg.value > 0, 'no ETH sent');

        IWETH weth = IWETH(aaveWETH);
        weth.deposit{value: msg.value}(); // wrap into WETH
        weth.approve(address(aavePool), 0);
        weth.approve(address(aavePool), msg.value);
        aavePool.supply(aaveWETH, msg.value, author, 0);

        positions[author][aaveWETH].supplied += msg.value;
        emit Supplied(author, aaveWETH, msg.value);
    }

    /// @notice Supply ERC20 tokens (e.g., USDT) on behalf of the author.
    function supplyERC20(
        address author,
        address token,
        uint256 amount
    ) external nonReentrant onlyRole(STAKING_OPERATOR_ROLE) {
        require(author != address(0), 'author required');
        require(amount > 0, 'amount required');

        IERC20(token).safeTransferFrom(author, address(this), amount);
        IERC20(token).safeIncreaseAllowance(address(aavePool), amount);
        aavePool.supply(token, amount, author, 0);

        positions[author][token].supplied += amount;
        emit Supplied(author, token, amount);
    }

    /// @notice Withdraw supplied assets and yield back to the author (SC-AA-003/004/005).
    function withdraw(address token, uint256 amount) external nonReentrant {
        require(amount > 0, 'amount required');
        Position storage pos = positions[msg.sender][token];
        require(pos.supplied >= amount, 'insufficient supplied');

        uint256 withdrawn = aavePool.withdraw(token, amount, address(this));
        if (withdrawn > pos.supplied) {
            withdrawn = pos.supplied;
        }
        pos.supplied -= withdrawn;

        if (token == aaveWETH) {
            // unwrap and send ETH
            IWETH(aaveWETH).withdraw(withdrawn);
            (bool sent, ) = msg.sender.call{value: withdrawn}('');
            require(sent, 'ETH transfer failed');
        } else {
            IERC20(token).safeTransfer(msg.sender, withdrawn);
        }

        emit Withdrawn(msg.sender, token, amount, withdrawn);
    }
}
