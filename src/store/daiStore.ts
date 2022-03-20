import axios from 'axios'
import { NETWORK } from 'store/networks'
import BN from 'bn.js'

export async function queryDaiBalance(
  queryKey: string,
  address: string
): Promise<BN> {
  try {
    const response = await axios.get(
      `https://onchain-values.backend.ideamarket.io/daiBalance/${NETWORK.getNetworkName()}/${address}`
    )
    return new BN(response.data.value)
  } catch (ex) {
    throw Error('Failed to query dai balance')
  }
}
