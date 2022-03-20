import useReversePrice from 'actions/useReversePrice'
import { useState } from 'react'
import { NETWORK } from 'store/networks'
import BN from 'bn.js'
import {
  bigNumberTenPow18,
  calculateIdeaTokenDaiValue,
  formatNumberWithCommasAsThousandsSerperator,
  web3BNToFloatString,
} from 'utils'
import { IdeaMarket, IdeaToken } from 'store/ideaMarketsStore'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import classNames from 'classnames'
import { useBalance } from 'actions'
import { getMarketSpecificsByMarketName } from 'store/markets'
import { useWeb3React } from '@web3-react/core'

const sliderCurve = Math.exp
const inverseCurve = Math.log

const sliderMarksYou = {
  [inverseCurve(1)]: '1',
  [inverseCurve(10)]: '10',
  [inverseCurve(100)]: '100',
  [inverseCurve(1000)]: '1K',
  [inverseCurve(10000)]: '10K',
  [inverseCurve(100000)]: '100K',
  [inverseCurve(1000000)]: '1M',
  [inverseCurve(10000000)]: '10M',
}
const sliderMarksOther = {
  [-inverseCurve(10000000)]: '-10M',
  [-inverseCurve(1000000)]: '-1M',
  [-inverseCurve(100000)]: '-100K',
  [-inverseCurve(10000)]: '-10K',
  [-inverseCurve(1000)]: '-1K',
  [-inverseCurve(100)]: '-100',
  [-inverseCurve(10)]: '-10',
  [inverseCurve(1)]: '1',
  [inverseCurve(10)]: '10',
  [inverseCurve(100)]: '100',
  [inverseCurve(1000)]: '1K',
  [inverseCurve(10000)]: '10K',
  [inverseCurve(100000)]: '100K',
  [inverseCurve(1000000)]: '1M',
  [inverseCurve(10000000)]: '10M',
}

const CustomSlider = Slider.createSliderWithTooltip(Slider)

type Props = {
  ideaToken: IdeaToken
  market: IdeaMarket
}

const InvestmentCalculator = ({ ideaToken, market }: Props) => {
  const marketSpecifics = market && getMarketSpecificsByMarketName(market.name)
  const [usdBuyAmount, setUsdBuyAmount] = useState(100)
  const [otherUsdBuyAmount, setOtherUsdBuyAmount] = useState(10000)

  const isSell = otherUsdBuyAmount < 0

  // Calculates the ideaToken amount for usdBuyAmount
  const [, ideaTokenAmountBN] = useReversePrice(
    ideaToken,
    market,
    NETWORK.getExternalAddresses().dai,
    usdBuyAmount.toString(),
    18,
    'buy'
  )

  // Calculates the ideaToken amount for otherUsdBuyAmount
  const [, otherIdeaTokenAmountBN] = useReversePrice(
    ideaToken,
    market,
    NETWORK.getExternalAddresses().dai,
    (isSell ? otherUsdBuyAmount * -1 : otherUsdBuyAmount).toString(),
    18,
    'buy'
  )

  const ideaTokenValue = web3BNToFloatString(
    calculateIdeaTokenDaiValue(
      ideaTokenAmountBN
        ? ideaToken?.rawSupply?.add(ideaTokenAmountBN)
        : new BN('0'),
      market,
      ideaTokenAmountBN
    ),
    bigNumberTenPow18,
    2
  )

  const supplyAfterYouAndOther =
    ideaTokenAmountBN && otherIdeaTokenAmountBN
      ? ideaToken?.rawSupply?.add(
          ideaTokenAmountBN.add(
            isSell ? otherIdeaTokenAmountBN.neg() : otherIdeaTokenAmountBN
          )
        )
      : new BN('0')
  // This is your idea token value after others buy/sell
  const otherIdeaTokenValue = web3BNToFloatString(
    calculateIdeaTokenDaiValue(
      supplyAfterYouAndOther,
      market,
      ideaTokenAmountBN
    ),
    bigNumberTenPow18,
    2
  )

  const buyProfit = +otherIdeaTokenValue - +ideaTokenValue
  const buyWorth = +usdBuyAmount + buyProfit

  const calculatePercentChange = (a: number, b: number) =>
    100 * ((b - a) / Math.abs(a))
  const percentChange = formatNumberWithCommasAsThousandsSerperator(
    parseInt(calculatePercentChange(+usdBuyAmount, buyWorth).toString())
  )

  const { account } = useWeb3React()
  const [, userIdeaTokenBalanceBN, isUserIdeaTokenBalanceLoading] = useBalance(
    ideaToken?.address,
    account,
    18
  )

  const userIdeaTokenValue = web3BNToFloatString(
    calculateIdeaTokenDaiValue(
      ideaToken && userIdeaTokenBalanceBN
        ? ideaToken?.rawSupply?.add(userIdeaTokenBalanceBN)
        : new BN('0'),
      market,
      userIdeaTokenBalanceBN
    ),
    bigNumberTenPow18,
    2
  )

  const displayName =
    marketSpecifics && ideaToken
      ? marketSpecifics.getTokenDisplayName(ideaToken.name)
      : ''

  return (
    <div className="px-2">
      <div className="pb-5 mb-5 border-b text-center text-xl text-gray-400 font-medium">
        Price Calculator
      </div>
      <div>
        <div className="flex flex-col md:flex-row items-center mb-10">
          <div className="w-24 mr-4 mb-2 md:mb-0 font-bold text-sm text-center md:text-right">
            <span>You buy</span>
          </div>
          <div className="w-full">
            <CustomSlider
              defaultValue={inverseCurve(100)}
              onChange={(value) =>
                setUsdBuyAmount(parseInt(sliderCurve(value).toString()))
              }
              marks={sliderMarksYou}
              step={(inverseCurve(10000000) - inverseCurve(1)) / 100} // 100 steps in range
              min={inverseCurve(1)}
              max={inverseCurve(10000000)}
              tipFormatter={(value) =>
                `$${formatNumberWithCommasAsThousandsSerperator(
                  parseInt(sliderCurve(value).toString())
                )}`
              }
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center mb-8">
          <div className="w-24 mr-4 mb-2 md:mb-0 font-bold text-sm text-center md:text-right">
            <span>Others {otherUsdBuyAmount <= 0 ? 'sell' : 'buy'}</span>
          </div>
          <div className="w-full">
            <CustomSlider
              defaultValue={inverseCurve(10000)}
              onChange={(value) => {
                const isNegative = value < 0
                const updatedValue = isNegative ? value * -1 : value
                // Can only sell up to (marketCap - yourBalance)
                const amountThatCanBeSold =
                  ideaToken && !isUserIdeaTokenBalanceLoading
                    ? parseFloat(ideaToken.marketCap) -
                      parseFloat(userIdeaTokenValue)
                    : 0
                if (
                  isNegative &&
                  amountThatCanBeSold <= sliderCurve(updatedValue)
                ) {
                  setOtherUsdBuyAmount(
                    -parseInt(amountThatCanBeSold.toString())
                  )
                  return
                }
                setOtherUsdBuyAmount(
                  (isNegative ? -1 : 1) *
                    parseInt(sliderCurve(updatedValue).toString())
                )
              }}
              marks={sliderMarksOther}
              step={(inverseCurve(10000000) - -inverseCurve(10000000)) / 100} // 100 steps in range
              min={-inverseCurve(10000000)}
              max={inverseCurve(10000000)}
              tipFormatter={(value) => {
                const isNegative = value < 0
                const updatedValue = isNegative ? value * -1 : value
                return `$${formatNumberWithCommasAsThousandsSerperator(
                  (isNegative ? -1 : 1) *
                    parseInt(sliderCurve(updatedValue).toString())
                )}`
              }}
            />
          </div>
        </div>
        <div className="pt-4">
          <p className="mb-4" style={{ overflowWrap: 'break-word' }}>
            If you buy{' '}
            <span className="text-blue-700 font-bold">
              ${formatNumberWithCommasAsThousandsSerperator(usdBuyAmount)}
            </span>{' '}
            worth of {displayName}, and then others{' '}
            {otherUsdBuyAmount <= 0 ? 'sell' : 'buy'}{' '}
            <span className="text-blue-700 font-bold">
              $
              {formatNumberWithCommasAsThousandsSerperator(
                Math.abs(otherUsdBuyAmount)
              )}
            </span>{' '}
            more,
          </p>
          <p>
            Your buy would be worth{' '}
            <span
              className={classNames(
                isSell ? 'text-red-500' : 'text-green-300',
                'font-bold'
              )}
            >
              ~$
              {formatNumberWithCommasAsThousandsSerperator(
                parseInt(buyWorth.toString())
              )}
            </span>
            , a{' '}
            <span
              className={classNames(
                isSell ? 'text-red-500' : 'text-green-300',
                'font-bold'
              )}
            >
              {!isSell && '+'}
              {percentChange}%
            </span>{' '}
            change.
          </p>
        </div>
      </div>
    </div>
  )
}

export default InvestmentCalculator
