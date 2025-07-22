// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Example {
    uint256[] public data;

    function addData(uint256 x) public {
        for (uint256 i = 0; i < data.length; i++) {
            if (data[i] == x) {
                return;
            }
        }
        data.push(x);
    }

    function wasteGas() public {
        for (uint256 i = 0; i < 10; i++) {
            useless += i;
        }
    }
}
