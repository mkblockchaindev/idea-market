import { useContractStore } from 'store/contractStore'
import BN from 'bn.js'

export default function migrateTokensToArbitrum(
  marketID: number,
  tokenID: number,
  l2Recipient: string
) {
  const exchangeContract = useContractStore.getState().exchangeContractL1

  const maxSubmissionCost = new BN('5000000000000000') // 0.005 ETH
  const l2GasLimit = new BN('3000000') // 3MM
  const l2GasPriceBid = new BN('4000000000') // 4 gwei

  const value = maxSubmissionCost.add(l2GasLimit.mul(l2GasPriceBid))

  return exchangeContract.methods
    .transferIdeaTokens(
      marketID,
      tokenID,
      l2Recipient,
      l2GasLimit,
      maxSubmissionCost,
      l2GasPriceBid
    )
    .send({
      value: value,
    })
}
