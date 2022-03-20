import axios from 'axios'
import { web3TenPow18 /*, bigNumberTenPow18 */ } from '../utils'
import { NETWORK } from 'store/networks'
import BN from 'bn.js'
//import BigNumber from 'bignumber.js'

export async function querySupplyRate(queryKey: string): Promise<number> {
  /*
    From https://compound.finance/docs

    The Annual Percentage Yield (APY) for supplying or borrowing in each market can be
    calculated using the value of supplyRatePerBlock (for supply APY) or borrowRatePerBlock
    (for borrow APY) in this formula:

    Rate = cToken.supplyRatePerBlock(); // Integer
    Rate = 37893566
    ETH Mantissa = 1 * 10 ^ 18 (ETH has 18 decimal places)
    Blocks Per Day = 6570 (13.15 seconds per block)
    Days Per Year = 365

    APY = ((((Rate / ETH Mantissa * Blocks Per Day + 1) ^ Days Per Year)) - 1) * 100

    NOTE: We leave out the *100 at the end since we do not want the result in percentages (0-100) but rather between (0-1)
    */

  /*try {
    const response = await axios.get(
      `https://onchain-values.backend.ideamarket.io/cDaiSupplyRate/${NETWORK.getNetworkName()}`
    )
    const rate = new BigNumber(response.data.value)
    const mantissa = bigNumberTenPow18
    const blocksPerDay = new BigNumber('6570')
    const daysPerYear = new BigNumber('365')
    const one = new BigNumber('1')
    const result = rate
      .dividedBy(mantissa)
      .multipliedBy(blocksPerDay)
      .plus(one)
      .exponentiatedBy(daysPerYear)
      .minus(one)
    return Number(result.toFixed(8))
  } catch (ex) {
    throw Error('Failed to query cDai Supply Rate')
  }*/

  // Since there is no Compound on L2 yet, hardcode this to some value
  return 0.06
}

export async function queryExchangeRate(queryKey: string): Promise<BN> {
  try {
    const response = await axios.get(
      `https://onchain-values.backend.ideamarket.io/cDaiExchangeRate/${NETWORK.getNetworkName()}`
    )
    return new BN(response.data.value)
  } catch (ex) {
    throw Error('Failed to query cDai Exchange Rate')
  }
}

export async function queryCDaiBalance(
  queryKey: string,
  address: string
): Promise<BN> {
  try {
    const response = await axios.get(
      `https://onchain-values.backend.ideamarket.io/cDaiBalance/${NETWORK.getNetworkName()}/${address}`
    )
    return new BN(response.data.value)
  } catch (ex) {
    throw Error('Failed to query cDai balance')
  }
}

export function investmentTokenToUnderlying(
  invested: BN,
  exchangeRate: BN
): BN {
  if (!invested || !exchangeRate) {
    return new BN('0')
  }

  return invested.mul(exchangeRate).div(web3TenPow18)
}
