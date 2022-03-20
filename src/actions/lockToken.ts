import BN from 'bn.js'
import { useContractStore } from 'store/contractStore'

export default function lockToken(
  ideaTokenAddress: string,
  amount: BN,
  lockDuration: number,
  recipientAddress: string
) {
  const ideaTokenVault = useContractStore.getState().ideaTokenVaultContract

  const contractCall = ideaTokenVault.methods.lock(
    ideaTokenAddress,
    amount,
    lockDuration,
    recipientAddress
  )

  return contractCall.send()
}
