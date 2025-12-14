// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title YIDENGToken
/// @notice Platform ERC20 token used for payments (SC-TK-002) and rewards (SC-TK-003/005).
contract YIDENGToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant REWARD_DISTRIBUTOR_ROLE = keccak256("REWARD_DISTRIBUTOR_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @dev Optional cap to satisfy SC-TK-001 (total supply controllable).
    uint256 public cap;

    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);

    constructor(string memory name_, string memory symbol_, uint256 cap_) ERC20(name_, symbol_) {
        cap = cap_;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(REWARD_DISTRIBUTOR_ROLE, msg.sender);
        // Adjust initial roles when wiring deployment scripts or proxies.
    }

    /// @notice Mint tokens to `to` (SC-TK-005).
    function mint(address to, uint256 amount) external {
        require(
            hasRole(REWARD_DISTRIBUTOR_ROLE, msg.sender) || hasRole(MINTER_ROLE, msg.sender),
            "not authorized"
        );
        _enforceCap(amount);
        _mint(to, amount);
        emit Mint(to, amount);
    }

    /// @notice Burn caller balance or allowance per ERC20Burnable (SC-TK-001).
    function burn(uint256 amount) public override {
        super.burn(amount);
        emit Burn(_msgSender(), amount);
    }

    /// @notice Burn from approved balance.
    function burnFrom(address account, uint256 amount) public override {
        super.burnFrom(account, amount);
        emit Burn(account, amount);
    }

    function _enforceCap(uint256 mintAmount) internal view {
        if (cap > 0) {
            require(totalSupply() + mintAmount <= cap, "cap exceeded");
        }
    }
}
