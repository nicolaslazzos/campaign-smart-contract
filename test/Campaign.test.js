const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

// web3 allows us to interact with the deployed contract in our test ethereum network
// to do this we need to pass it a provider from ganache, the library that creates the network
const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  // factory.setProvider(provider);

  await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '1000000' });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  // here we are not deploying a contract, but refering one that is already deployed by passing it the address
  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('campaigns', () => {
  it('deploys a fectory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('sets the caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({ from: accounts[1], value: '200' });
    const isApprover = campaign.methods.approvers(accounts[1]).call();
    assert(isApprover);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({ from: accounts[1], value: '10' });
      campaign.methods.approvers(accounts[1]).call();
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.createRequest('test request', '100', accounts[1]).send({ from: accounts[0], gas: '1000000' });
    const request = await campaign.methods.requests(0).call();
    assert.equal('test request', request.description);
  });

  it('processes requests', async() => {
    let initialBalance = await web3.eth.getBalance(accounts[1]);
    initialBalance = parseFloat(web3.utils.fromWei(initialBalance, 'ether'));

    await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei('10', 'ether') });
    await campaign.methods.createRequest('test request', web3.utils.toWei('5', 'ether'), accounts[1]).send({ from: accounts[0], gas: '1000000' });
    await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: '1000000' });
    await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: '1000000' });
    
    let balance = await web3.eth.getBalance(accounts[1]);
    balance = parseFloat(web3.utils.fromWei(balance, 'ether'));

    assert(balance > initialBalance);

    const request = await campaign.methods.requests(0).call();
    
    assert(request.complete);
  })
})