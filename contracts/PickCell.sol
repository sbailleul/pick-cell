pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IPickCell.sol";

contract PickCell is ERC721URIStorage, Ownable, IPickCell {
    using Strings for uint256;
    uint16 constant _gridWidth = 10;
    uint16 constant _gridHeight = 10;
    //Size equals gridWidth x gridHeight
    uint256 [100] colors;

    constructor() ERC721("PickCell", "PXL") {
    }
    function gridWidth()  external pure override returns (uint16) {
        return _gridWidth;
    }

    function gridHeight() external pure override returns (uint16) {
        return _gridHeight;
    }

    function safeMint(uint256 tokenId, string memory tokenURI)
    external override
    returns (uint256)
    {
        uint32 tokenIdUpperLimit = _gridWidth * _gridHeight;
        require(tokenId < tokenIdUpperLimit, string(abi.encodePacked("Token id should be lower than token limit: ", tokenIdUpperLimit)));
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    function setColor(uint256 tokenId, uint256 color) external override isApprovedOrOwner(tokenId) {
        colors[tokenId] = color;
        emit ChangeColor(msg.sender, tokenId, color);
    }

    function getColor(uint256 tokenId) external view override returns (uint256){
        return colors[tokenId];
    }

    function exists(uint256 tokenId) external view override returns (bool){
        return _exists(tokenId);
    }


    modifier isApprovedOrOwner(uint256 tokenId) {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Cannot edit token not owned");
        _;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "http://localhost:3000";
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


}
