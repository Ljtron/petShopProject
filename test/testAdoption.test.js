const Adoption = artifacts.require("Adoption");

let adoption;
contract("Adoption", function(accounts){
    let expectedPet;
    let expectedAdopter;

    before(async () => {
        adoption = await Adoption.deployed();
    })

    describe("Adopting a pet and retrieving account address", async() => {
        before("adopt a pet using account[0]", async() => {
            await adoption.adopt(8, {from: accounts[0]})
            expectedAdopter = accounts[0]
        })

        it("can fetch the address of the owner by the pet id", async() => {
            var address = await adoption.adopters(8);
            assert.equal(address, expectedAdopter, "The owner of the adopted pet should be the first address");            
        })

        it("fetch the collection of all pet owners", async() => {
            var adopters = await adoption.getAdopters();
            assert.equal(adopters[8], expectedAdopter, "The owner of the 8th pet should be the owner of the expectedAdopter address");
        })
    })
})