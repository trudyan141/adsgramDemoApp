import axios from 'axios';
import { TON_NETWORKS } from "../constants/tonConfigs";
const API_KEY = process.env.NEXT_PUBLIC_TON_API_KEY || ''
// Set the Bearer token globally
axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;

const getNetworkByChainId = (chainId) => {
    return TON_NETWORKS.find(network => network.chainId === chainId) || null;
}
const getAccountInfo = async (params) => { 
  try { 
    const { account_id, chainId } = params;
    const network = getNetworkByChainId(chainId);
    if (!network) { 
      throw "Cannot find network!"
    }
    const url = `${network.apiUrl}/v2/accounts/${account_id}`
    const rs = await axios.get(url);
    return rs?.data;
  } catch (error) {
    console.log("🚀 ~ getAccountInfo ~ error:", error)
    return null;
  }
}
export default {
  getNetworkByChainId,
  getAccountInfo
}