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

    struct HSEStudent {
        string name;
        uint8 mark;
        bool isLanguageJS;
    }

    mapping(uint => HSEStudent) students;

    event SetStudent(uint id, string indexed name, uint8 mark, bool isLanguageJS);
    event DeleteStudent(uint id);


    function setStudent(uint _id, string memory _name, uint8 _mark, bool _isLanguageJS) public {
        emit SetStudent(_id, _name, _mark, _isLanguageJS);
        students[_id] = HSEStudent(_name, _mark, _isLanguageJS);
    }

    function deleteStudent(uint _id) public {
        emit DeleteStudent(_id);
        delete students[_id];
    }

    function getStudent(uint _id) public view returns (HSEStudent memory) {
        return students[_id];
    }

}
