import React, { useContext } from 'react'
import { useWalletStore } from 'store/walletStore'
import { useQuery } from 'react-query'
import { NETWORK } from 'store/networks'
import { GlobalContext } from 'pages/_app'
import Image from 'next/image'
import { queryDaiBalance } from 'store/daiStore'
import {
  web3BNToFloatString,
  bigNumberTenPow18,
  formatNumberWithCommasAsThousandsSerperator,
} from 'utils'
import ModalService from 'components/modals/ModalService'
import { ListTokenModal, WalletModal } from 'components'
import Plus from '../../assets/plus-white.svg'
import A from 'components/A'
import BN from 'bn.js'
import { useMixPanel } from 'utils/mixPanel'

const HomeHeader = ({
  setTradeOrListSuccessToggle,
  tradeOrListSuccessToggle,
}: any) => {
  const { mixpanel } = useMixPanel()
  const { setOnWalletConnectedCallback } = useContext(GlobalContext)

  const { interestManagerAVM: interestManagerAddress } =
    NETWORK.getDeployedAddresses()

  const { data: interestManagerDaiBalance } = useQuery(
    ['interest-manager-dai-balance', interestManagerAddress],
    queryDaiBalance,
    {
      refetchOnWindowFocus: false,
    }
  )

  const onListTokenClicked = () => {
    mixpanel.track('ADD_LISTING_START')

    const onClose = () => setTradeOrListSuccessToggle(!tradeOrListSuccessToggle)
    if (!useWalletStore.getState().web3) {
      setOnWalletConnectedCallback(() => () => {
        ModalService.open(ListTokenModal, {}, onClose)
      })
      ModalService.open(WalletModal)
    } else {
      ModalService.open(ListTokenModal, {}, onClose)
    }
  }

  const daiBalance = formatNumberWithCommasAsThousandsSerperator(
    web3BNToFloatString(
      interestManagerDaiBalance || new BN('0'),
      bigNumberTenPow18,
      0
    )
  )

  return (
    <div className="px-6 pt-10 pb-40 text-center text-white bg-cover dark:text-gray-200 bg-top-mobile md:bg-top-desktop">
      <div>
        <div className="flex flex-wrap justify-center mt-4">
          <div
            className="flex justify-center flex-grow-0 flex-shrink-0 mt-4"
            data-aos="zoom-y-out"
          >
            <A href="https://www.nasdaq.com/articles/ideamarket-is-a-literal-marketplace-for-ideas-and-online-reputation-2021-02-19">
              <div className="relative h-8 opacity-50 w-36">
                <Image
                  src="/nasdaq.png"
                  alt="Nasdaq"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-full"
                />
              </div>
            </A>
          </div>
          <div
            className="flex justify-center flex-grow-0 flex-shrink-0 mt-4"
            data-aos="zoom-y-out"
          >
            <A href="https://www.vice.com/en/article/pkd8nb/people-have-spent-over-dollar1-million-on-a-literal-marketplace-of-ideas">
              <div className="relative w-32 h-8 opacity-50">
                <Image
                  src="/vice.png"
                  alt="Vice"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-full"
                />
              </div>
            </A>
          </div>
          <div
            className="flex justify-center flex-grow-0 flex-shrink-0 mt-4"
            data-aos="zoom-y-out"
          >
            <A href="https://www.coindesk.com/ideamarket-online-ideas-online-reputation">
              <div className="relative h-8 opacity-50 w-36">
                <Image
                  src="/coindesk.png"
                  alt="Coindesk"
                  layout="fill"
                  objectFit="contain"
                  priority={true}
                  className="rounded-full"
                />
              </div>
            </A>
          </div>
        </div>
        <h2 className="mt-8 text-3xl md:text-6xl font-gilroy-bold">
          The <span className="text-brand-blue">literal</span> marketplace of
          ideas
        </h2>
        <p className="mt-8 text-lg md:text-2xl font-sf-compact-medium">
          Buy on the right side of history.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center md:flex-row">
        <button
          onClick={onListTokenClicked}
          className="py-2 mt-10 text-lg font-bold text-white rounded-lg w-44 font-sf-compact-medium bg-brand-blue hover:bg-blue-800"
        >
          <div className="flex flex-row items-center justify-center">
            <Plus width="30" height="30" />
            <div className="ml-0.5 md:ml-2">Add Listing</div>
          </div>
        </button>
        <button
          className="py-2 mt-3 text-lg font-bold text-white border border-white rounded-lg md:mt-10 md:ml-5 w-44 font-sf-compact-medium hover:bg-white hover:text-brand-blue"
          onClick={() => {
            window.open('https://docs.ideamarket.io/', '_blank')
            mixpanel.track('LINK_WHITEPAPER')
          }}
        >
          What is Ideamarket?
        </button>
      </div>
      <div className="flex flex-col items-center justify-center mt-10 text-md md:text-3xl font-gilroy-bold md:flex-row">
        <div className="text-2xl text-brand-blue md:text-5xl">
          ${daiBalance}
        </div>
        <div className="md:ml-2">of information valued</div>
        <div
          className="flex justify-center flex-grow-0 flex-shrink-0 mt-8 md:mt-0 md:ml-6 mr-8 md:mr-0"
          data-aos="zoom-y-out"
        >
          <A href="https://docs.ideamarket.io/contracts/audit">
            <div className="relative h-8 opacity-50 w-40">
              <Image
                src="/Quantstamp.svg"
                alt="Quantstamp"
                layout="fill"
                objectFit="contain"
                priority={true}
                className="rounded-full"
              />
            </div>
          </A>
        </div>
      </div>
    </div>
  )
}

export default HomeHeader
