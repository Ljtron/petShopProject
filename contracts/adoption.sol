pragma solidity ^0.5.0;

contract Adoption{
    address[16] public adopters;

    function adopt(uint _petId) public returns(uint){
        require(_petId >= 0 && _petId <= 15, "Your pet id must remain between 0 and 15");

        adopters[_petId] = msg.sender;

        return(_petId);
    }

    function getAdopters() public view returns(address[16] memory){
        return adopters;
    }
}