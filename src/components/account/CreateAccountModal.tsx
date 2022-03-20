import Modal from '../modals/Modal'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import useAuth from './useAuth'
import { useWeb3React } from '@web3-react/core'
import WalletGreenIcon from '../../assets/wallet-green.svg'
import { useContext, useEffect } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
import { getSignedInWalletAddress } from 'lib/utils/web3-eth'

export default function CreateAccountModal({ close }: { close: () => void }) {
  const { jwtToken } = useContext(GlobalContext)
  const { active, account, library } = useWeb3React()

  const { loginByWallet } = useAuth()
  const onLoginClicked = async () => {
    if (active) {
      const signedWalletAddress = await getSignedInWalletAddress({
        account,
        library,
      })
      await loginByWallet(signedWalletAddress)
    }
  }

  useEffect(() => {
    if (jwtToken) close()
  }, [close, jwtToken])

  return (
    <Modal close={close}>
      <div className="p-6 bg-white w-96 md:w-[28rem]">
        <div className="flex justify-between items-center">
          <span className="text-2xl text-left text-black text-opacity-90 md:text-3xl font-gilroy-bold font-bold">
            Create account or login using your wallet
          </span>
        </div>

        <div className="flex items-center my-8">
          <WalletGreenIcon className="w-6 h-6" />
          <p
            className="text-sm font-semibold ml-2 font-inter"
            style={{ overflowWrap: 'anywhere' }}
          >
            {account}
          </p>
        </div>

        <p className="text-sm font-inter text-gray-400 font-normal my-8">
          Click{' '}
          <span
            className="text-brand-blue font-semibold cursor-pointer"
            onClick={onLoginClicked}
          >
            SIGN
          </span>{' '}
          on the wallet dialogue box.
        </p>

        <p className="text-sm font-inter text-gray-400 font-normal my-8">
          This request will <span className="font-semibold">NOT</span> trigger a
          blockchain transaction or cost any gas fees.
        </p>

        <p className="text-sm font-inter text-gray-400 font-normal p-3 border-brand-blue border rounded-2xl bg-brand-blue/10">
          <span>
            <IoMdInformationCircleOutline className="w-6 h-6 text-gray-900" />
          </span>{' '}
          Your authentication status will reset after{' '}
          <span className="text-gray-900 font-semibold">30 days.</span>
        </p>
      </div>
    </Modal>
  )
}
