import { useState, useEffect, useContext } from 'react'
import classNames from 'classnames'
import BN from 'bn.js'
import { SHA3 } from 'sha3'
import { GlobalContext } from 'pages/_app'
import {
  requestVerification,
  submitVerification,
  submitVerificationFee,
  submitVerificationFeeHash,
} from 'actions'
import { IdeaMarket, IdeaToken } from 'store/ideaMarketsStore'
import { getMarketSpecificsByMarketName } from 'store/markets'
import { useWalletStore } from 'store/walletStore'
import {
  bigNumberTenPow18,
  useTransactionManager,
  web3BNToFloatString,
} from '../utils'
import { NETWORK } from 'store/networks'
import { Modal, CircleSpinner } from './'
import A from './A'
import ModalService from './modals/ModalService'
import WalletModal from './wallet/WalletModal'
import { isETHAddress } from 'utils/addresses'

export default function VerifyModal({
  close,
  market,
  token,
}: {
  close: () => void
  market: IdeaMarket
  token: IdeaToken
}) {
  const STATE = {
    TOS: 0,
    OWNER_ADDRESS: 1,
    SHOW_SHA: 2,
    SHOW_FEE_TX: 3,
    AWAIT_FEE_TX: 4,
    SUCCESS: 5,
    ERROR: 6,
  }

  const [verificationState, setVerificationState] = useState(STATE.TOS)

  const connectedAddress = useWalletStore((state) => state.address)
  const [ownerAddress, setOwnerAddress] = useState('')
  const isValidOwnerAddress = isETHAddress(ownerAddress)

  const { setOnWalletConnectedCallback } = useContext(GlobalContext)

  const [uuid, setUUID] = useState('')
  const sha = new SHA3(256).update(uuid).digest('hex').toString().substr(0, 12)
  const [tx, setTx] = useState('')
  const [weiFee, setWeiFee] = useState('0')
  const [feeTo, setFeeTo] = useState('')
  const txManager = useTransactionManager()
  const marketSpecifics = getMarketSpecificsByMarketName(market.name)
  const marketVerificationExplanation =
    marketSpecifics.getVerificationExplanation()
  const shaPromptExplanation =
    marketSpecifics.getVerificationSHAPromptExplanation()
  const shaPrompt = marketSpecifics.getVerificationSHAPrompt(
    sha,
    market.name.toLowerCase(),
    (token as any)?.listingId
  )
  const confirmCheckboxText =
    marketSpecifics.getVerificationConfirmCheckboxLabel()

  const [tosCheckboxChecked, setTOSCheckboxChecked] = useState(false)
  const [confirmCheckboxChecked, setConfirmCheckboxChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function openWalletModal() {
    setOnWalletConnectedCallback(() => () => {
      const addr = useWalletStore.getState().address
      setOwnerAddress(addr)
    })
    ModalService.open(WalletModal)
  }

  async function initiateVerification() {
    setIsLoading(true)
    try {
      setUUID(await requestVerification(token, ownerAddress))
      setVerificationState(STATE.SHOW_SHA)
    } catch (ex) {
      setErrorMessage(ex)
      setVerificationState(STATE.ERROR)
    }

    setIsLoading(false)
  }

  async function verificationSubmitted() {
    setIsLoading(true)
    let response: {
      wantFee: boolean
      weiFee?: string
      to?: string
      tx?: string
    }
    try {
      response = await submitVerification(uuid)
    } catch (ex) {
      setErrorMessage(ex)
      setVerificationState(STATE.ERROR)
    }

    if (response.wantFee) {
      setWeiFee(response.weiFee)
      setFeeTo(response.to)
      setVerificationState(STATE.SHOW_FEE_TX)
    } else {
      setTx(response.tx)
      setVerificationState(STATE.SUCCESS)
    }

    setIsLoading(false)
  }

  async function submitFee() {
    setIsLoading(true)
    let hash: string
    try {
      await txManager.executeTxWithCallbacks(
        'Verification Fee',
        submitVerificationFee,
        {
          onHash: (h: string) => {
            hash = h
            setVerificationState(STATE.AWAIT_FEE_TX)
          },
        },
        feeTo,
        new BN(weiFee),
        sha
      )
    } catch (ex) {
      setErrorMessage('The verification fee transaction failed.')
      setVerificationState(STATE.ERROR)
      setIsLoading(false)
      return
    }

    try {
      setTx(await submitVerificationFeeHash(uuid, hash))
      setVerificationState(STATE.SUCCESS)
    } catch (ex) {
      setErrorMessage(ex)
      setVerificationState(STATE.ERROR)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setVerificationState(STATE.TOS)
    setOwnerAddress('')
    setUUID('')
    setTOSCheckboxChecked(false)
    setConfirmCheckboxChecked(false)
    setTx('')
    setIsLoading(false)
    setErrorMessage('')
  }, [STATE.TOS])

  return (
    <Modal close={close}>
      <div className="md:min-w-150 md:max-w-150">
        <div className="p-4 bg-top-mobile ">
          <p className="text-2xl text-center text-gray-300 md:text-3xl font-gilroy-bold">
            Verify: {token.name}
          </p>
        </div>
        <div className="p-5 text-brand-gray-2 dark:text-gray-300">
          {verificationState === STATE.TOS && (
            <>
              <p className="mt-5 text-xl font-bold text-center">
                Terms of Service
              </p>
              <div className="w-full mt-5 overflow-y-auto max-h-96">
                By using Ideamarket, you are agreeing to become bound by and
                comply with the{' '}
                <A
                  href="https://docs.ideamarket.io/legal/terms-of-service"
                  className="underline"
                >
                  Ideamarket Terms and Conditions
                </A>
                , as they may be updated from time to time in the sole
                discretion of Idea Markets, Inc. Among other things, the Terms
                and Conditions provide that, in order to use Ideamarket: <br />
                <br />
                <ul>
                  <li>
                    - You must be an adult of sound mind and the ability to
                    understand and evaluate the risks of using Ideamarket;{' '}
                  </li>
                  <li>
                    - Your use of Ideamarket must comply with all applicable
                    laws, rules and regulations;{' '}
                  </li>
                  <li>
                    - You must not subject to national or international
                    sanctions or located or ordinarily resident in Cuba, Iran,
                    North Korea, Sudan, Syria, the Crimea region or any other
                    country or jurisdiction against which the U.S. maintains
                    economic sanctions;{' '}
                  </li>
                  <li>
                    - You use Ideamarket solely for its intended purposes of
                    providing support signals for accounts on supported
                    third-party social media platforms, and must not use
                    Ideamarket to conduct any ICO or securities offering or
                    other regulated financial activity; and
                  </li>
                  <li>
                    - Will not hold Idea Markets, Inc. or its representatives or
                    affiliates liable for any damages you suffer in connection
                    with your use of Ideamarket.{' '}
                  </li>
                </ul>
                <br />
                <br />
                The above is only a partial summary of the Ideamarket Terms and
                Conditions. You should read the{' '}
                <A
                  href="https://docs.ideamarket.io/legal/terms-of-service"
                  className="underline"
                >
                  Terms and Conditions
                </A>{' '}
                in their entirety. In the event of any conflict or consistency
                between this summary and the Terms and Conditions, the Terms and
                Conditions will prevail.
              </div>
              <div className="flex items-center justify-center mt-5">
                <input
                  type="checkbox"
                  id="tosCheckbox"
                  className="cursor-pointer"
                  checked={tosCheckboxChecked}
                  onChange={(e) => {
                    setTOSCheckboxChecked(e.target.checked)
                  }}
                />
                <label htmlFor="tosCheckbox" className="ml-2 cursor-pointer">
                  I have read and agree to the above
                </label>
              </div>
              <div className="flex justify-center">
                <button
                  disabled={!tosCheckboxChecked}
                  className={classNames(
                    'mt-5 w-32 h-10 text-base border-2 rounded-lg tracking-tightest-2 font-sf-compact-medium',
                    tosCheckboxChecked
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'bg-white dark:bg-gray-500 dark:text-gray-300  border-brand-gray-2 text-brand-gray-2 cursor-not-allowed'
                  )}
                  onClick={() => {
                    setVerificationState(STATE.OWNER_ADDRESS)
                  }}
                >
                  I understand
                </button>
              </div>
            </>
          )}
          {verificationState === STATE.OWNER_ADDRESS && (
            <>
              <p className="text-sm">
                Verify ownership of this listing to withdraw the accumulated
                interest at any time.
              </p>
              <br />
              <p>{marketVerificationExplanation}</p>
              <div className="mt-10 text-lg text-center">
                <strong>Address to be listed as owner</strong>
              </div>
              <div className="flex flex-col items-center justify-center mt-1 md:flex-row md:mx-2">
                <div className="w-full md:flex-grow">
                  <input
                    className={classNames(
                      'pl-2 w-full h-10 leading-tight border-2 rounded appearance-none focus:outline-none focus:bg-white',
                      ownerAddress.length === 0
                        ? 'border-gray-200 focus:border-brand-blue bg-gray-200'
                        : isValidOwnerAddress
                        ? 'border-brand-green'
                        : 'border-brand-red'
                    )}
                    disabled={isLoading}
                    value={ownerAddress}
                    onChange={(e: any) => {
                      setOwnerAddress(e.target.value)
                    }}
                    placeholder="0x..."
                  />
                </div>
                <button
                  className="mt-2 md:mt-0 md:ml-2.5 w-32 h-10 text-sm text-brand-blue bg-white border border-brand-blue rounded-lg tracking-tightest-2 font-sf-compact-medium hover:bg-brand-blue hover:text-white"
                  disabled={isLoading}
                  onClick={() => {
                    connectedAddress !== undefined && connectedAddress !== ''
                      ? setOwnerAddress(connectedAddress)
                      : openWalletModal()
                  }}
                >
                  Use connected
                </button>
              </div>
              <div className="flex justify-center mt-10">
                <button
                  disabled={isLoading || !isValidOwnerAddress}
                  className={classNames(
                    'w-32 h-10 text-base border-2 rounded-lg tracking-tightest-2 font-sf-compact-medium',
                    isLoading
                      ? 'border-brand-blue'
                      : isValidOwnerAddress
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'bg-white border-brand-gray-2 text-brand-gray-2 cursor-not-allowed'
                  )}
                  onClick={initiateVerification}
                >
                  {isLoading ? (
                    <div className="flex justify-center">
                      <CircleSpinner color="#0857e0" />
                    </div>
                  ) : (
                    'Next'
                  )}
                </button>
              </div>
            </>
          )}
          {verificationState === STATE.SHOW_SHA && (
            <>
              <p>{shaPromptExplanation}</p>
              <div className="mt-7.5 p-5 border border-brand-gray-2 bg-gray-200 rounded text-black">
                {shaPrompt}
              </div>
              <div className="flex items-center justify-center mt-10">
                <input
                  type="checkbox"
                  id="confirmCheckbox"
                  checked={confirmCheckboxChecked}
                  onChange={(e) => {
                    setConfirmCheckboxChecked(e.target.checked)
                  }}
                />
                <label htmlFor="confirmCheckbox" className="ml-2">
                  {confirmCheckboxText}
                </label>
              </div>
              <div className="flex justify-center">
                <button
                  disabled={isLoading || !confirmCheckboxChecked}
                  className={classNames(
                    'mt-2 w-32 h-10 text-base border-2 rounded-lg tracking-tightest-2 font-sf-compact-medium',
                    isLoading
                      ? 'border-brand-blue'
                      : confirmCheckboxChecked
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'bg-white border-brand-gray-2 text-brand-gray-2 cursor-not-allowed'
                  )}
                  onClick={verificationSubmitted}
                >
                  {isLoading ? (
                    <div className="flex justify-center">
                      <CircleSpinner color="#0857e0" />
                    </div>
                  ) : (
                    'Next'
                  )}
                </button>
              </div>
            </>
          )}
          {verificationState === STATE.SHOW_FEE_TX && (
            <>
              <div className="text-xl text-center">
                <strong>Verification fee</strong>
              </div>
              <p className="mt-5">
                Ownership verified!
                <br />
                <br />A one-time payment of{' '}
                <i>
                  {web3BNToFloatString(new BN(weiFee), bigNumberTenPow18, 5)}{' '}
                  ETH
                </i>{' '}
                is required to cover the Ethereum network fee for transferring
                listing ownership to you.
                <br />
                <br />
                After payment, you will be permanently able to withdraw your
                interest from this wallet at any time.
                <br />
              </p>
              <div className="flex justify-center">
                <button
                  disabled={isLoading}
                  className={classNames(
                    'mt-2 w-32 h-10 text-base border-2 rounded-lg tracking-tightest-2 font-sf-compact-medium',
                    isLoading
                      ? 'border-brand-blue'
                      : 'bg-brand-blue text-white border-brand-blue'
                  )}
                  onClick={submitFee}
                >
                  {isLoading ? (
                    <div className="flex justify-center">
                      <CircleSpinner color="#0857e0" />
                    </div>
                  ) : (
                    'Transfer'
                  )}
                </button>
              </div>
            </>
          )}
          {verificationState === STATE.AWAIT_FEE_TX && (
            <>
              <div className="text-xl text-center">
                <strong>Transaction is pending</strong>
              </div>
              <div className="flex justify-center mt-5">
                <CircleSpinner color="#0857e0" />
              </div>
              <div className="mt-2 text-center">
                Please wait for transaction{' '}
                <A
                  className={classNames('underline')}
                  href={NETWORK.getEtherscanTxUrl(txManager.hash)}
                >
                  {txManager.hash && txManager.hash.slice(0, 8)}...
                  {txManager.hash && txManager.hash.slice(-6)}
                </A>{' '}
                to confirm. Do not close or refresh the page.
              </div>
            </>
          )}
          {verificationState === STATE.SUCCESS && (
            <>
              <div className="text-2xl text-center text-brand-green">
                <strong>Verification successful</strong>
              </div>
              <p className="mt-5">
                Your ownership of this token has been successfully verified.
                <br />
                <br />A transaction to set the address you provided as owner of
                this token has been broadcast to the blockchain. After this
                transaction has been confirmed you will be able to withdraw the
                accumulated interest.
              </p>
              <div className="p-5 mt-5 text-black bg-gray-200 border rounded border-brand-gray-2">
                <A className="underline" href={NETWORK.getEtherscanTxUrl(tx)}>
                  Transaction: {tx.slice(0, 8)}...{tx.slice(-6)}
                </A>
              </div>
              <div className="flex justify-center mt-10">
                <button
                  className="w-32 h-10 text-base bg-white border-2 rounded-lg hover:bg-brand-blue hover:text-white tracking-tightest-2 font-sf-compact-medium text-brand-blue border-brand-blue"
                  onClick={() => close()}
                >
                  Close
                </button>
              </div>
            </>
          )}
          {verificationState === STATE.ERROR && (
            <>
              <div className="text-2xl text-center text-brand-red">
                <strong>Something went wrong</strong>
              </div>
              <p className="mt-5 text-center">{errorMessage}</p>
              <div className="flex justify-center mt-10">
                <button
                  className="w-32 h-10 text-base bg-white border-2 rounded-lg hover:bg-brand-blue hover:text-white tracking-tightest-2 font-sf-compact-medium text-brand-blue border-brand-blue"
                  onClick={() => close()}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
