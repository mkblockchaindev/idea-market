import { useWalletStore } from '../store/walletStore'
import BN from 'bn.js'

export default function submitVerificationFee(
  to: string,
  amount: BN,
  sha: string
) {
  const web3 = useWalletStore.getState().web3

  return web3.eth.sendTransaction({
    to: to,
    value: amount,
    data: sha,
    gas: 25000,
  })
}
