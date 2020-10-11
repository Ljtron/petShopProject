App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Adoption.json", function(data){

      // get the data of the contract and instantiates it with @truffle/contract
      var adoptionArtifact = data
      App.contracts.Adoption = TruffleContract(adoptionArtifact);

      // set the provider for the contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-sendBack', App.sendBack)
  },

  markAdopted: function() {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance){
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters){
      console.log(adopters)
      web3.eth.getAccounts(function(err, accounts){
        if(err){
          console.log(err)
        }
        else{
          for(i=0; i<adopters.length; i++){
            if(adopters[i] != "0x0000000000000000000000000000000000000000"){
              var petPanel = $('.panel-pet').eq(i)
              if(adopters[i] == accounts[0] && (petPanel.find('button.btn-adopt').text() != "adopt")){
                petPanel.find('button.btn-adopt').text('Owned').attr('disabled', true).attr("class", "btn btn-secondary");
                petPanel.find('button.btn-sendBack').show();
                // var newButton = $("<button class='btn btn-default btn-sendBack' type='button' data-id=" + "'" + i + "'" + "id='sendBack-btn'>send back</button>")
                // petPanel.find("#petBody-row").append(newButton)
              }
              else{
                $('.panel-pet').eq(i).find('button.btn-adopt').text('Success').attr('disabled', true).attr("class", "btn btn-success");
              }
            }
          }
        }
      })
    }).catch(function(error){
      console.log(error)
    })
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;
    web3.eth.getAccounts(function(err, accounts){
      if(err){
        console.log("Error with accounts: " + err);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance){
        adoptionInstance = instance;

        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(data){
        console.log(data)
        return App.markAdopted();
      }).catch(function(error){
        console.log(error.message)
      })
    })
  },

  sendBack: function(event){
    event.preventDefault();

    var petId = parseInt($(event.target).data("id"));
    console.log(petId);
    var adoptionInstance;
    web3.eth.getAccounts(function(error, accounts){
      var account = accounts[0];
      if(error){
        console.log(error);
      }
      else{
        App.contracts.Adoption.deployed().then(function(instance){
          adoptionInstance = instance;

          return adoptionInstance.sendBack(petId, {from: account})
        }).then(function(data){
          return App.markAdopted();
        }).catch(function(error){
          console.log(error.message)
        })
      }
    })
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
