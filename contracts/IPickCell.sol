pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IPickCell  {
    event ChangeColor(address indexed owner, uint256 indexed tokenId, uint256 color);

    function gridWidth() external pure returns (uint16);

    function gridHeight() external pure returns (uint16);

    function safeMint(uint256 tokenId, string memory tokenURI) external returns (uint256);
    function setColor(uint256 tokenId, uint256 color) external;
    function getColor(uint256 tokenId) external view returns (uint256);
    function exists(uint256 tokenId) external view virtual returns (bool);
}
