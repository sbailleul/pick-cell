// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

struct Pixel{
    uint16 x;
    uint16 y;
    uint color;
}

contract Migrations is ERC721   {
    address public owner = msg.sender;
    uint public last_completed_migration;

    Pixel[] public pixels;
    mapping (uint => address) public pixelToOwner;
    mapping (address => uint) ownerPixelsCount;


    modifier restricted() {
        require(
            msg.sender == owner,
            "This function is restricted to the contract's owner"
        );
        _;
    }

    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }
}
