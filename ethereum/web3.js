import Web3 from 'web3';
import { rinkeby } from './env';

const getWeb3 = async () => {
  let web3;

  if (typeof window !== 'undefined' && (window.web3 || window.ethereum)) {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error(error);
      }
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    }
  } else {
    const provider = new Web3.providers.HttpProvider(rinkeby);
    web3 = new Web3(provider);
  }

  return web3;
}

export default getWeb3;