import React from 'react'
import classNames from 'classnames'
import BigNumber from 'bignumber.js'
import Tooltip from 'components/tooltip/Tooltip'
import { A } from 'components'
import { useQuery } from 'react-query'
import { queryInterestManagerTotalShares } from 'store/ideaMarketsStore'
import { queryDaiBalance } from 'store/daiStore'
import { NETWORK } from 'store/networks'
import BN from 'bn.js'
import {
  bigNumberTenPow18,
  formatNumber,
  formatNumberWithCommasAsThousandsSerperator,
  bnToFloatString,
} from 'utils'
import { getMarketSpecificsByMarketName, useMarketStore } from 'store/markets'
import { toggleMarketHelper } from '../utils/OverviewUtils'
import { GlobeAltIcon } from '@heroicons/react/outline'
import useThemeMode from 'components/useThemeMode'
import { useMixPanel } from 'utils/mixPanel'

type Props = {
  currentColumn: string
  orderDirection: string
  columnData: Array<any>
  selectedMarkets: Set<string>
  columnClicked: (column: string) => void
  onMarketChanged: (set: Set<string>) => void
}

function IncomeColumn() {
  return (
    <>
      1YR
      <br />
      <div className="flex items-center">
        Income [Paused]
        <Tooltip className="ml-1">
          <div className="w-32 md:w-64">
            ARBITRUM UPGRADE: Since{' '}
            <A href="https://compound.finance" className="underline">
              compound.finance
            </A>{' '}
            is not on Arbitrum, interest generation has been paused until they
            launch, or we replace them with another lending protocol. Columns
            currently display 6% APR
          </div>
        </Tooltip>
      </div>
    </>
  )
}

export const OverviewColumns = ({
  currentColumn,
  orderDirection,
  columnData,
  selectedMarkets,
  columnClicked,
  onMarketChanged,
}: Props) => {
  const { mixpanel } = useMixPanel()

  const { data: interestManagerTotalShares } = useQuery(
    'interest-manager-total-shares',
    queryInterestManagerTotalShares
  )

  const interestManagerAddress =
    NETWORK.getDeployedAddresses().interestManagerAVM
  const { data: interestManagerDaiBalance } = useQuery(
    ['interest-manager-dai-balance', interestManagerAddress],
    queryDaiBalance
  )

  const marketObjects = useMarketStore((state) => state.markets)
  const markets = marketObjects.map((m) => m.market)

  const twitterMarketSpecifics = getMarketSpecificsByMarketName('Twitter')
  const { resolvedTheme } = useThemeMode()

  let allPlatformsEarnedBN = new BigNumber('0')
  const platformEarnedPairs = [] // { name, earned } -- name = platform name, earned = amount platform earned
  markets.forEach((market) => {
    const platformEarnedBN =
      interestManagerTotalShares && interestManagerDaiBalance
        ? new BigNumber(market.rawPlatformFeeInvested.toString())
            .dividedBy(new BigNumber(interestManagerTotalShares.toString()))
            .multipliedBy(new BigNumber(interestManagerDaiBalance.toString()))
            .plus(
              new BigNumber(
                (market.rawPlatformFeeRedeemed || new BN('0')).toString()
              )
            )
        : new BigNumber('0')

    const platformEarned = bnToFloatString(
      platformEarnedBN,
      bigNumberTenPow18,
      4
    )
    platformEarnedPairs.push({
      name: market.name,
      earned:
        parseFloat(platformEarned) < 1000
          ? formatNumber(parseFloat(platformEarned))
          : formatNumberWithCommasAsThousandsSerperator(
              parseInt(platformEarned)
            ),
    })
    allPlatformsEarnedBN = allPlatformsEarnedBN.plus(platformEarnedBN)
  })

  const toggleMarket = (marketName: string) => {
    let newSet = null
    if (marketName === 'URL') {
      newSet = toggleMarketHelper('URL', selectedMarkets)
      newSet = toggleMarketHelper('Minds', newSet)
      newSet = toggleMarketHelper('Substack', newSet)
      newSet = toggleMarketHelper('Showtime', newSet)
      newSet = toggleMarketHelper('Wikipedia', newSet)
    } else {
      newSet = toggleMarketHelper(marketName, selectedMarkets)
    }

    onMarketChanged(newSet)
    mixpanel.track('FILTER_PLATFORM', { platforms: marketName })
  }

  function getColumnContent(column) {
    const isURLSelected = selectedMarkets.has('URL')
    const isPeopleSelected = selectedMarkets.has('Twitter')

    switch (column.value) {
      case 'name':
        return (
          <div className="flex items-center space-x-2">
            <button
              className={classNames(
                'flex justify-center items-center md:px-3 p-2 md:rounded-md text-sm font-semibold',
                {
                  'text-brand-blue dark:text-white bg-blue-100 border-2 border-blue-600 dark:bg-very-dark-blue':
                    isURLSelected,
                },
                {
                  'text-brand-black dark:text-gray-50 bg-white border':
                    !isURLSelected,
                }
              )}
              onClick={() => {
                toggleMarket('URL')
              }}
            >
              <GlobeAltIcon className="w-5 mr-1" />
              <span>URLs</span>
            </button>
            <button
              className={classNames(
                'flex justify-center items-center md:px-3 p-2 md:rounded-md text-sm font-semibold',
                {
                  'text-brand-blue dark:text-white bg-blue-100 border-2 border-blue-600 dark:bg-very-dark-blue':
                    isPeopleSelected,
                },
                {
                  'text-brand-black dark:text-gray-50 bg-white border':
                    !isPeopleSelected,
                }
              )}
              onClick={() => {
                toggleMarket('Twitter')
              }}
            >
              <span className="w-5 mr-1">
                {twitterMarketSpecifics?.getMarketSVGTheme(resolvedTheme)}
              </span>
              <span>Users</span>
            </button>
          </div>
        )
      case 'income':
        return <IncomeColumn />
      case 'claimable':
        return (
          <>
            Claimable
            <br />
            Income
          </>
        )
      case 'dayChange':
        return (
          <>
            24H
            <br />
            Change
          </>
        )

      case 'weekChange':
        return (
          <>
            7D
            <br />
            Change
          </>
        )
      default:
        return column.content
    }
  }

  return (
    <>
      {columnData.map((column) => {
        // For last 2 column headers, do not use header title. Instead, show money earned by platforms
        if (column.value === 'trade') {
          return (
            <th
              colSpan={2}
              className="pr-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50 dark:bg-gray-600 dark:text-gray-50"
              key={column.value}
            >
              Votes
            </th>
          )
        } else {
          return (
            <th
              className={classNames(
                'pl-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50 dark:bg-gray-600 dark:text-gray-50',
                column.sortable && 'cursor-pointer',
                column.value !== 'rank' && 'pr-6'
              )}
              key={column.value}
              onClick={() => {
                if (column.sortable) {
                  columnClicked(column.value)
                }
              }}
            >
              {column.sortable && (
                <>
                  {currentColumn === column.value &&
                    orderDirection === 'asc' && <span>&#x25B2;&nbsp;</span>}
                  {currentColumn === column.value &&
                    orderDirection === 'desc' && <span>&#x25bc;&nbsp;</span>}
                </>
              )}
              {getColumnContent(column)}
            </th>
          )
        }
      })}
    </>
  )
}
