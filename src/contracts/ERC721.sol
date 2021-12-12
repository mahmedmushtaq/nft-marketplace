// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
     building out the minting function
        a- nft to point to an address
        b- keep track of the token ids
        c- keep track of token owner address to the token ids
        d- keep track of how many token an owner address has
        e- create an event that emit and transfer log - contract address
        where it is being minted to.    
     */

contract ERC721 {
  event Transfer(
    address indexed from,
    address indexed to,
    uint256 indexed tokenId
  );

  // mapping from tokenId to owner
  mapping(uint256 => address) private _tokenOwner;
  // mapping owner to number of tokens
  mapping(address => uint256) private _ownedTokensCount;

  /// @notice Count all NFTs assigned to an owner
  /// @dev NFTs assigned to the zero address are considered invalid, and this
  ///  function throws for queries about the zero address.
  /// @param _owner An address for whom to query the balance
  /// @return The number of NFTs owned by `_owner`, possibly zero
  function balanceOf(address _owner) public view returns (uint256) {
    require(_owner != address(0), "Owner query for non-existent tokens");
    uint256 balance = _ownedTokensCount[_owner];
    return balance;
  }

  /// @notice Find the owner of an NFT
  /// @dev NFTs assigned to zero address are considered invalid, and queries
  ///  about them do throw.
  /// @param _tokenId The identifier for an NFT
  /// @return The address of the owner of the NFT
  function ownerOf(uint256 _tokenId) external view returns (address) {
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

  /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
  ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
  ///  THEY MAY BE PERMANENTLY LOST
  /// @dev Throws unless `msg.sender` is the current owner, an authorized
  ///  operator, or the approved address for this NFT. Throws if `_from` is
  ///  not the current owner. Throws if `_to` is the zero address. Throws if
  ///  `_tokenId` is not a valid NFT.
  /// @param _from The current owner of the NFT
  /// @param _to The new owner
  /// @param _tokenId The NFT to transfer
  // prettier-ignore
  function transferFrom(address _from, address _to, uint256 _tokenId) external payable{
      
    }
}
