import TadaIcon from '../../assets/tada.svg'
import { RiGasStationFill } from 'react-icons/ri'
import { IoMdOpen } from 'react-icons/io'
import { BsExclamationLg } from 'react-icons/bs'

import React, { useState } from 'react'
import Image from 'next/image'
import { useWeb3React } from '@web3-react/core'

import useClaimable from 'actions/useClaimable'
import claimIMO from 'actions/claimIMO'
import {
  formatNumberWithCommasAsThousandsSerperator,
  useTransactionManager,
} from 'utils'
import { BreakdownPoint } from './EligibilityOutcome'

import TradeCompleteModal, {
  TRANSACTION_TYPES,
} from 'components/trade/TradeCompleteModal'
import ModalService from 'components/modals/ModalService'
import classNames from 'classnames'
// import { BreakdownPointCard } from './BreakdownPointCard'
import A from 'components/A'
import { AIRDROP_TYPES } from 'types/airdropTypes'

interface Props {
  setClaimStep: (any) => void
  breakdownByPoint?: BreakdownPoint[]
  airdropType: AIRDROP_TYPES
}

export const Eligible: React.FC<Props> = ({
  setClaimStep,
  // breakdownByPoint,
  airdropType,
}) => {
  const { account } = useWeb3React()
  const claimableIMO: number = useClaimable(account, airdropType)
  const txManager = useTransactionManager()
  const [txFailed, setTxFailed] = useState<Boolean>(false)
  const [loading, setLoading] = useState<Boolean>(false)

  const onTradeComplete = (
    isSuccess: boolean,
    tokenName: string,
    transactionType: TRANSACTION_TYPES,
    marketName: string
  ) => {
    ModalService.open(TradeCompleteModal, {
      isSuccess,
      tokenName,
      transactionType,
      marketName,
    })
  }

  const onClaimButtonClick = async () => {
    setLoading(true)
    setTxFailed(false)
    try {
      await txManager.executeTx('claim', claimIMO, account, airdropType)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setTxFailed(true)
      onTradeComplete(false, 'IMO', TRANSACTION_TYPES.NONE, 'no-market')
      return
    }

    setLoading(false)
    // onTradeComplete(true, 'IMO', TRANSACTION_TYPES.CLAIM, 'no-market')
    setClaimStep((c) => c + 1)
  }

  return (
    <>
      <div className="mb-8 md:mb-0 mr-0 md:mr-4">
        <div className="my-6 text-3xl font-extrabold">
          <span className="opacity-75 font-gilroy-bold">
            Woohoo, You are eligible!
          </span>
          <TadaIcon className="h-full inline ml-2" />
        </div>
        <div className="my-6 text-5xl font-extrabold font-gilroy-bold opacity-75">
          Claim your{' '}
          <span className="bg-gradient-to-r bg-clip-text from-brand-blue-1 to-brand-blue-2 font-black text-transparent">
            {formatNumberWithCommasAsThousandsSerperator(claimableIMO)}
          </span>{' '}
          $IMO
          <div className="ml-2 p-1 w-10 h-10 inline-block rounded-full bg-white shadow">
            <div className="relative w-8 h-8">
              <Image
                src="/logo.png"
                alt="Workflow logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
        <div className="my-4 text-base font-light opacity-75">
          Because of your engagement with the Ideamarket platform, you are
          entitled to some $IMO.
        </div>
        <div>
          <div
            className={classNames(
              'p-5 border rounded-3xl w-full md:max-w-sm',
              txFailed
                ? 'border-red-400 bg-red-100'
                : 'border-brand-border-gray-2'
            )}
          >
            <div className="flex flex-col items-start">
              <div className="flex">
                <RiGasStationFill color="gray" className="w-8 h-8 " />
                <div className="flex flex-col ml-4">
                  <span className="opacity-75 font-extrabold text-base mt-1">
                    Eth Gas : 65 Gwei
                  </span>
                  <span className="opacity-75 font-normal my-2 text-sm">
                    Claiming $IMO requires you to pay gas fees using L2 $ETH on
                    the Arbitrum Network.
                  </span>
                  <div className="text-sm ml-auto cursor-pointer">
                    <A
                      href="https://docs.ideamarket.io/user-guide/tutorial#bridging-crypto-to-layer-2-abritrum"
                      target="_blank"
                      className="flex items-center "
                    >
                      <span className="mr-2 opacity-75 underline">
                        Learn more
                      </span>
                      <IoMdOpen color="gray" className="w-5 h-5" />
                    </A>
                  </div>
                </div>
              </div>

              {txFailed && (
                <div className="flex ">
                  <BsExclamationLg className="w-5 h-5 text-white bg-red-400 rounded-full p-1" />
                  <span className="ml-4 font-extrabold text-red-400">
                    Insufficent ETH balance
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onClaimButtonClick}
          className={classNames(
            'mt-10 bg-gradient-to-r from-brand-blue-1 to-brand-blue-2 text-white font-bold w-full max-w-sm py-5 rounded-xl hidden md:flex flex-col items-center',
            loading ? 'opacity-50' : ''
          )}
        >
          <div className="text-xs font-thin">
            Ready? <br />
          </div>
          <span className="uppercase">
            Claim tokens {txFailed ? '(try again)' : ''}
          </span>
        </button>
      </div>
      <div className="flex flex-col items-center justify-center h-full w-full md:w-96 my-auto">
        <div className="flex flex-col mx-auto w-full md:w-96">
          {/* <span className="text-gray-400 text-left text-sm mb-4">
            Here's a breakdown of your claim...
          </span>
          {breakdownByPoint.map((data, id) => (
            <BreakdownPointCard key={id} data={data} />
          ))}
          <span className="text-gray-400 text-sm my-2">
            *Any action performed on Layer 1 provides double points for that
            action.
          </span> */}
        </div>
        <button
          onClick={onClaimButtonClick}
          className={classNames(
            'bg-gradient-to-r from-brand-blue-1 to-brand-blue-2 text-white font-bold w-full max-w-sm py-5 rounded-xl flex md:hidden flex-col items-center mt-6',
            loading ? 'opacity-50' : 'opacity-100'
          )}
        >
          <div className="text-xs font-thin">
            Ready? <br />
          </div>
          <span className="uppercase">
            Claim tokens {txFailed ? '(try again)' : ''}
          </span>
        </button>
      </div>
    </>
  )
}
