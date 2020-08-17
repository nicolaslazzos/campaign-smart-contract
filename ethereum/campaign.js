import getWeb3 from './web3';
import compiledCampaign from './build/Campaign.json';

const getCampaign = async campaignAddress => {
  try {
    const web3 = await getWeb3();
    return new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
  }catch(error) {
    console.error(error);
  }
};

export default getCampaign;