import { getERC20Contract } from 'store/contractStore'
import BN from 'bn.js'

export default function approveToken(
  tokenAddress: string,
  spenderAddress: string,
  amount: BN
) {
  const tokenContract = getERC20Contract(tokenAddress)
  return tokenContract.methods.approve(spenderAddress, amount).send()
}
