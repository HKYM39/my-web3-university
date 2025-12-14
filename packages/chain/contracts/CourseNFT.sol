// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from '@openzeppelin/contracts/access/AccessControl.sol';
import {ERC721} from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import {Strings} from '@openzeppelin/contracts/utils/Strings.sol';

/// @title CourseNFT
/// @notice Soulbound token representing course access (SBT). Transfer/approvals are blocked per PRD.
contract CourseNFT is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');

    /// @dev tokenId => courseId
    mapping(uint256 => uint256) public tokenCourse;
    /// @dev courseId => tokenIds
    mapping(uint256 => uint256[]) public courseTokens;
    /// @dev user => tokenIds
    mapping(address => uint256[]) public userTokens;

    uint256 internal _nextTokenId;

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /// @notice Mint SBT after course purchase (SC-NFT-001/002).
    function mintCourseToken(
        address to,
        uint256 courseId
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = ++_nextTokenId;
        _safeMint(to, tokenId);
        tokenCourse[tokenId] = courseId;
        courseTokens[courseId].push(tokenId);
        userTokens[to].push(tokenId);
        return tokenId;
    }

    /// @dev Override to block approvals.
    function approve(address, uint256) public pure override {
        revert('SBT: approvals disabled');
    }

    /// @dev Override to block operator approvals.
    function setApprovalForAll(address, bool) public pure override {
        revert('SBT: operator approvals disabled');
    }

    /// @dev Central transfer restriction hook for ERC721 v5 (_update replaces _transfer).
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert('SBT: non-transferable');
        }
        return super._update(to, tokenId, auth);
    }

    /// @notice Expose owned tokens for a user (SC-NFT-005).
    function tokensOfOwner(
        address owner
    ) external view returns (uint256[] memory) {
        // TODO: consider pagination for large sets.
        return userTokens[owner];
    }

    /// @notice Expose tokens for a course.
    function tokensOfCourse(
        uint256 courseId
    ) external view returns (uint256[] memory) {
        return courseTokens[courseId];
    }

    /// @notice Token URI hook placeholder.
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), 'nonexistent token');
        uint256 courseId = tokenCourse[tokenId];
        return
            string(
                abi.encodePacked(
                    'https://metadata.yideng/course/',
                    Strings.toString(courseId)
                )
            );
    }

    /// @dev Resolve multiple inheritance for ERC721 + AccessControl.
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
