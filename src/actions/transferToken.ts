import BN from 'bn.js'
import { getERC20Contract } from 'store/contractStore'

export default function transferToken(
  tokenAddress: string,
  recipientAddress: string,
  amount: BN
) {
  const tokenContract = getERC20Contract(tokenAddress)

  const contractCall = tokenContract.methods.transfer(recipientAddress, amount)

  return contractCall.send()
}
