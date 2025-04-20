// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LotinuToken is ERC20, Ownable {
    uint256 private constant INITIAL_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    
    constructor() ERC20("Lotinu Token", "LOTINU") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    // Optional: Add burn functionality
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    // Optional: Add mint functionality (only owner)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
