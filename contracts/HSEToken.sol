// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HSEToken is Ownable, ERC20("HSE Token", "HSE") {
    constructor() {
        uint256 decimalPart = 10**decimals();
        uint256 initialSupply = 10**5 * decimalPart; // 100k tokens
        _mint(msg.sender, initialSupply);
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }
}
