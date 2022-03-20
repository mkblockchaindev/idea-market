import classNames from 'classnames'
import { IdeaToken } from 'store/ideaMarketsStore'
import { getMarketSpecificsByMarketName } from 'store/markets'
import {
  formatNumber,
  formatNumberWithCommasAsThousandsSerperator,
} from 'utils'
import { MutualTokensListSortBy, A } from 'components'
import { useTokenIconURL } from 'actions'
import useThemeMode from 'components/useThemeMode'
import Image from 'next/image'

export default function MutualToken({
  stats,
  token,
  sortBy,
}: {
  stats: { latestTimestamp: number; totalAmount: number; totalHolders: number }
  token: IdeaToken
  sortBy: MutualTokensListSortBy
}) {
  const marketSpecifics = getMarketSpecificsByMarketName(token.marketName)
  const { tokenIconURL, isLoading: isTokenIconLoading } = useTokenIconURL({
    marketSpecifics,
    tokenName: token.name,
  })
  const { resolvedTheme } = useThemeMode()
  return (
    <>
      <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-700 ">
        <h2 className="sr-only" id="profile-overview-title">
          Profile Overview
        </h2>
        <div className="p-6 bg-white dark:bg-gray-700">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex lg:space-x-5">
              <div className="flex-shrink-0">
                {isTokenIconLoading ? (
                  <div className="w-20 h-20 mx-auto bg-gray-400 rounded-full animate-pulse"></div>
                ) : (
                  <div className="relative w-20 h-20 mx-auto">
                    <Image
                      src={tokenIconURL || '/gray.svg'}
                      alt={token.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                )}
              </div>
              <div className="mt-4 text-center lg:mt-0 lg:pt-1 lg:text-left">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Rank {token.rank}
                </p>
                <A
                  href={`/i/${marketSpecifics.getMarketNameURLRepresentation()}/${marketSpecifics.getTokenNameURLRepresentation(
                    token.name
                  )}`}
                >
                  <p className="flex justify-center text-xl font-bold text-gray-900 dark:text-gray-200 lg:text-xl hover:underline">
                    {marketSpecifics.getTokenDisplayName(token.name)}{' '}
                    <span className="w-5 h-5 ml-1">
                      {marketSpecifics.getMarketSVGTheme(resolvedTheme)}
                    </span>
                  </p>
                </A>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  ${formatNumber(token.latestPricePoint.price)}
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-5 lg:mt-0">
              <A
                href={`/i/${marketSpecifics.getMarketNameURLRepresentation()}/${marketSpecifics.getTokenNameURLRepresentation(
                  token.name
                )}`}
              >
                <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-500 dark:border-gray-500 dark:text-gray-300 hover:bg-gray-50">
                  View details
                </button>
              </A>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 border-t border-gray-200 divide-y divide-gray-200 bg-gray-50 dark:bg-gray-600 lg:grid-cols-2 lg:divide-y-0 lg:divide-x">
          <div
            className={classNames(
              'px-6 py-5 text-sm font-medium text-center lg:flex lg:flex-col',
              sortBy === 'totalHolders' &&
                'bg-brand-light-blue dark:bg-gray-500'
            )}
          >
            <span className="text-gray-900 dark:text-gray-200">
              {stats.totalHolders}
            </span>{' '}
            <span className="text-gray-600 dark:text-gray-300">
              mutual holders
            </span>
          </div>
          <div
            className={classNames(
              'px-6 py-5 text-sm font-medium text-center lg:flex lg:flex-col',
              sortBy === 'totalAmount' && 'bg-brand-light-blue dark:bg-gray-500'
            )}
          >
            <span className="text-gray-900 dark:text-gray-200">
              {formatNumberWithCommasAsThousandsSerperator(stats.totalAmount)}
            </span>{' '}
            <span className="text-gray-600 dark:text-gray-300">
              tokens held
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
