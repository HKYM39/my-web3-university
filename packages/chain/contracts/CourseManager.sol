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
import {YIDENGToken} from './YIDENGToken.sol';
import {CourseNFT} from './CourseNFT.sol';

/// @title CourseManager
/// @notice Core business contract that creates courses, handles purchases, and tracks revenue (PRD 4.2).
contract CourseManager is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant COURSE_CREATOR_ROLE =
        keccak256('COURSE_CREATOR_ROLE');

    struct Course {
        uint256 id;
        address author;
        uint256 price;
        bool isActive;
    }

    /// @dev courseId => Course metadata.
    mapping(uint256 => Course) public courses;
    /// @dev courseId => accumulated proceeds in ERC20 awaiting withdrawal.
    mapping(uint256 => uint256) public courseBalances;
    /// @dev courseId => accumulated ETH proceeds awaiting withdrawal.
    mapping(uint256 => uint256) public courseEthBalances;
    /// @dev courseId => buyer => hasPurchased to prevent duplicates (SC-CM-005).
    mapping(uint256 => mapping(address => bool)) public coursePurchasers;

    uint256 internal _nextCourseId;

    IERC20 public paymentToken; // YIDENG token address used for purchases.
    CourseNFT public courseNFT;

    event CourseCreated(
        uint256 indexed courseId,
        address indexed author,
        uint256 price
    );
    event CoursePurchased(uint256 indexed courseId, address indexed buyer);
    event CourseWithdraw(
        uint256 indexed courseId,
        address indexed author,
        uint256 amount
    );

    constructor(IERC20 paymentToken_, CourseNFT courseNFT_) {
        paymentToken = paymentToken_;
        courseNFT = courseNFT_;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COURSE_CREATOR_ROLE, msg.sender);
        // Set immutable references and roles through deployment scripts as needed.
    }

    /// @notice Authors create a course with fixed price (SC-CM-001, SC-CM-002).
    function createCourse(
        uint256 price
    ) external onlyRole(COURSE_CREATOR_ROLE) returns (uint256) {
        require(price > 0, 'price required');
        uint256 courseId = ++_nextCourseId;
        courses[courseId] = Course({
            id: courseId,
            author: msg.sender,
            price: price,
            isActive: true
        });
        emit CourseCreated(courseId, msg.sender, price);
        return courseId;
    }

    /// @notice Buy a course with ERC20 allowance or native payments (SC-CM-003/004/005).
    function buyCourse(uint256 courseId) external payable nonReentrant {
        Course memory course = courses[courseId];
        require(course.id != 0 && course.isActive, 'course not active');
        require(!coursePurchasers[courseId][msg.sender], 'already purchased');

        if (msg.value > 0) {
            // Optional ETH path: expect exact price in wei (PRD SC-CM-003).
            require(msg.value == course.price, 'invalid ETH amount');
            courseEthBalances[courseId] += msg.value;
        } else {
            // Default YIDENG token path (SC-CM-003/004).
            paymentToken.safeTransferFrom(
                msg.sender,
                address(this),
                course.price
            );
            courseBalances[courseId] += course.price;
        }

        coursePurchasers[courseId][msg.sender] = true;
        courseNFT.mintCourseToken(msg.sender, courseId); // Mints SBT access (SC-CM-004).

        emit CoursePurchased(courseId, msg.sender);
    }

    /// @notice Authors withdraw revenue for their course (SC-CM-007).
    function withdraw(uint256 courseId) external nonReentrant {
        Course memory course = courses[courseId];
        require(course.id != 0, 'course missing');
        require(course.author == msg.sender, 'not author');
        uint256 tokenAmount = courseBalances[courseId];
        uint256 ethAmount = courseEthBalances[courseId];
        require(tokenAmount > 0 || ethAmount > 0, 'no balance');
        courseBalances[courseId] = 0;
        courseEthBalances[courseId] = 0;

        if (tokenAmount > 0) {
            paymentToken.safeTransfer(msg.sender, tokenAmount);
        }
        if (ethAmount > 0) {
            (bool sent, ) = msg.sender.call{value: ethAmount}('');
            require(sent, 'ETH withdraw failed');
        }

        emit CourseWithdraw(courseId, msg.sender, tokenAmount + ethAmount);
    }

    /// @notice Helper to expose course details (SC-CM-006).
    function getCourse(uint256 courseId) external view returns (Course memory) {
        return courses[courseId];
    }
}
