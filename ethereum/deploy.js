const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
const { mnemonic, rinkeby } = require('./env');

const provider = new HDWalletProvider(mnemonic, rinkeby);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('deploying contract from account', accounts[0]);

  const factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  console.log('contract deployed at address', factory.options.address);

  // contract address 0x3b3BAb4d5d26E8ba3aBc584F32a03194789c0464
}

deploy();