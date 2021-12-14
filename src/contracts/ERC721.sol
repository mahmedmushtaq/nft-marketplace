// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ERC165.sol";
import "./interfaces/IERC721.sol";

/**
     building out the minting function
        a- nft to point to an address
        b- keep track of the token ids
        c- keep track of token owner address to the token ids
        d- keep track of how many token an owner address has
        e- create an event that emit and transfer log - contract address
        where it is being minted to.    
     */

contract ERC721 is ERC165, IERC721 {
  // mapping from tokenId to owner
  mapping(uint256 => address) private _tokenOwner;
  // mapping owner to number of tokens
  mapping(address => uint256) private _ownedTokensCount;
  // mapping tokenId to approved address
  mapping(uint256 => address) private _tokenApprovals;

  constructor() {
    _registerInterface(
      bytes4(
        keccak256("balanceOf(bytes4)") ^
          keccak256("ownerOf(bytes4)") ^
          keccak256("transferFrom(bytes4)")
      )
    );
  }

  function balanceOf(address _owner) public view returns (uint256) {
    require(_owner != address(0), "Owner query for non-existent tokens");
    uint256 balance = _ownedTokensCount[_owner];
    return balance;
  }

  function ownerOf(uint256 _tokenId) public view returns (address) {
    address owner = _tokenOwner[_tokenId];
    require(owner != address(0), "Owner query for non-existent tokens");
    return owner;
  }

  function _exists(uint256 tokenId) internal view returns (bool) {
    address owner = _tokenOwner[tokenId];
    return owner != address(0);
  }

  function _mint(address to, uint256 tokenId) internal virtual {
    //  ensure adress != 0
    require(to != address(0), "ERC721: minting to the zero address");
    //  ensure token not already exists
    require(!_exists(tokenId), "ERC721: token already minted");
    // we are adding new address with a tokenId for minting
    _tokenOwner[tokenId] = to;
    //  keeping track of each address that is minting and adding to the owner address
    _ownedTokensCount[to] += 1;

    emit Transfer(address(0), to, tokenId);
  }

  //  // this is not safe!
  function _transferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  ) internal {
    require(_to != address(0), "Error - ERC721 Transfer to the zero address");
    require(
      ownerOf(_tokenId) == _from,
      "Trying to transfer a token the address does not own!"
    );

    _ownedTokensCount[_from] -= 1;
    _ownedTokensCount[_to] += 1;

    _tokenOwner[_tokenId] = _to;

    emit Transfer(_from, _to, _tokenId);
  }

  // prettier-ignore
  function transferFrom(address _from, address _to, uint256 _tokenId) external payable{
      // require( isApprovedOrOwner(msg.sender), _tokenId)
      _transferFrom(_from, _to, _tokenId);
  }

  /**
  1- The person approving is the owner
  2- we are proving an address to a token ( tokenId )
  3- require that we cannot approve sending that token to owner to owner ( current caller )
   */
  function approve(address _to, uint256 _tokenId) public {
    address owner = ownerOf(_tokenId);
    require(_to != owner, "Error, approval to current owner");
    require(msg.sender == owner, "Current caller is not the owner");
    _tokenApprovals[_tokenId] = _to;
    emit Approval(owner, _to, _tokenId);
  }

  function isApprovedOrOwner(address spender, uint256 tokenId)
    internal
    view
    returns (bool)
  {}
}
