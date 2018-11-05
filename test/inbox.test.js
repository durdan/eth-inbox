const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface,bytecode} =  require('../compile')

const INITIAL_MESSAGE='Hi There!';
let accounts;
let inbox;
beforeEach(async () => {
  //Get a list of all Accounts
  // web3.eth.getAccounts().then(fetchedAccounts => {
  //       console.log(fetchedAccounts);
  //     });

  accounts = await web3.eth.getAccounts();

  //Use one of thnose Accounts to deploy
  //the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode,arguments: [INITIAL_MESSAGE]})
    .send({from: accounts[0], gas: '1000000'})


});

describe('Inbox', () => {
  it('Deploy a contract',() => {
        //console.log(inbox);// This will print the contract
        assert.ok(inbox.options.address);
    });

    // Test default message
   it('It has default Message', async () =>{
      const message = await inbox.methods.message().call();
      assert.equal(message,INITIAL_MESSAGE);
   });

   it('Can change the message', async () => {
     await inbox.methods.setMessage('bye').send({from: accounts[0]});
     const message = await inbox.methods.message().call();
     assert.equal(message,'bye');
   });

});
