// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library SafeMath {
  function add(uint256 x, uint256 y) internal pure returns (uint256) {
    uint256 r = x + y;
    require(r >= x, "SafeMath: additional Overflow occured");
    return r;
  }

  function sub(uint256 x, uint256 y) internal pure returns (uint256) {
    require(y <= x, "SafeMath: subtraction Overflow occured");
    return x - y;
  }

  function mul(uint256 x, uint256 y) internal pure returns (uint256) {
    if (x == 0) {
      return 0;
    }
    uint256 r = x * y;
    require(r / x == y, "SafeMath: multiplication Overflow occured");

    return r;
  }

  function divide(uint256 x, uint256 y) internal pure returns (uint256) {
    require(y > 0, "SafeMath: Division by zero");
    return x / y;
  }

  function mod(uint256 x, uint256 y) internal pure returns (uint256) {
    require(y != 0, "SafeMath: module by zero");
    return x % y;
  }
}
