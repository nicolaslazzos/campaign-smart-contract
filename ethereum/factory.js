import getWeb3 from './web3';
import compiledFactory from './build/CampaignFactory.json';
import { factoryAddress } from './env';

const getFactory = async () => {
  try {
    const web3 = await getWeb3();
    return new web3.eth.Contract(JSON.parse(compiledFactory.interface), factoryAddress);
  }catch(error) {
    console.error(error);
  }
};

export default getFactory;