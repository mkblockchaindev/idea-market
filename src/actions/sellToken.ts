import { useContractStore } from 'store/contractStore'
import { NETWORK } from 'store/networks'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'

export default function sellToken(
  ideaTokenAddress: string,
  outputTokenAddress: string,
  amount: BN,
  price: BN,
  slippage: number,
  recipientAddress: string
) {
  const exchange = useContractStore.getState().exchangeContract
  const multiAction = useContractStore.getState().multiActionContract

  const slippageAmount = new BN(
    new BigNumber(price.toString())
      .multipliedBy(new BigNumber(slippage))
      .toFixed(0)
  )
  const minPrice = price.sub(slippageAmount)

  let contractCall
  if (outputTokenAddress === NETWORK.getExternalAddresses().dai) {
    contractCall = exchange.methods.sellTokens(
      ideaTokenAddress,
      amount,
      minPrice,
      recipientAddress
    )
  } else {
    contractCall = multiAction.methods.sellAndConvert(
      outputTokenAddress,
      ideaTokenAddress,
      amount,
      minPrice,
      recipientAddress
    )
  }

  return contractCall.send()
}
