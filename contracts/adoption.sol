pragma solidity ^0.5.0;

contract Adoption{
    address[21] public adopters;

    function adopt(uint _petId) public returns(uint){
        require(_petId >= 0 && _petId <= 19, "Your pet id must remain between 0 and 19");
        require(adopters[_petId] == 0x0000000000000000000000000000000000000000, "Two people can't own the same animal");
        adopters[_petId] = msg.sender;

        return(_petId);
    }

    function getAdopters() public view returns(address[21] memory){
        return adopters;
    }

    function sendBack(uint _petId) public returns(uint){
        require(adopters[_petId] == msg.sender, "You are not the owner you can't see back a pet you don't own");
        address[1] memory test; 
        address fill = test[0];
        adopters[_petId] = fill;
        return _petId;
    }
}