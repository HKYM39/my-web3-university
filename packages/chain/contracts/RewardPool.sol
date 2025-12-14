// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {YIDENGToken} from './YIDENGToken.sol';

/// @title RewardPool
/// @notice Issues learning rewards in YIDENG token (PRD 4.4).
contract RewardPool is AccessControl, ReentrancyGuard {
    bytes32 public constant REWARD_DISTRIBUTOR_ROLE =
        keccak256('REWARD_DISTRIBUTOR_ROLE');

    YIDENGToken public rewardToken;

    /// @dev user => total rewarded amount (SC-RP-003/004).
    mapping(address => uint256) public rewarded;

    event RewardIssued(address indexed user, uint256 amount);

    constructor(YIDENGToken rewardToken_) {
        rewardToken = rewardToken_;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REWARD_DISTRIBUTOR_ROLE, msg.sender);
    }

    /// @notice Called by backend with distributor role to mint rewards (SC-RP-001/002/003).
    function rewardUser(
        address user,
        uint256 amount
    ) external nonReentrant onlyRole(REWARD_DISTRIBUTOR_ROLE) {
        require(user != address(0), 'user required');
        require(amount > 0, 'amount required');
        rewarded[user] += amount; // Track cumulative rewards (SC-RP-003/004).
        rewardToken.mint(user, amount); // Mint token directly to user (SC-RP-002/005).
        emit RewardIssued(user, amount);
    }
}
