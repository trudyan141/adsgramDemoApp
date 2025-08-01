const TON_CHAIN = {
  mainnet: '-239',
  testnet: '-3'
}
const TON_API_URL = {
  mainnet: 'https://tonapi.io',
  testnet: 'https://testnet.tonapi.io'
}
export const TON_NETWORKS = [{
  chainId: TON_CHAIN.mainnet,
  apiUrl: TON_API_URL.mainnet
},{
  chainId: TON_CHAIN.testnet,
  apiUrl: TON_API_URL.testnet
  }]
export const TON_DECIMALS = 9