import { useContractStore } from 'store/contractStore'

export default function withdrawTokenInterest(tokenAddress: string) {
  const exchangeContract = useContractStore.getState().exchangeContract
  return exchangeContract.methods.withdrawTokenInterest(tokenAddress).send()
}
