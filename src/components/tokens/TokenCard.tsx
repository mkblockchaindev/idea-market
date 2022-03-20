import classNames from 'classnames'
import { IdeaMarket, IdeaToken } from 'store/ideaMarketsStore'
import { getMarketSpecificsByMarketName } from 'store/markets'
import { WatchingStar } from '../'
import {
  bigNumberTenPow18,
  calculateCurrentPriceBN,
  formatNumber,
  web3BNToFloatString,
} from '../../utils'
import { useTokenIconURL } from 'actions'
import useThemeMode from 'components/useThemeMode'
import Image from 'next/image'

export default function TokenCard({
  token,
  market,
  enabled,
  classes,
  isLoading,
}: {
  token: IdeaToken
  market: IdeaMarket
  enabled: boolean
  classes?: string
  isLoading?: boolean
}) {
  const loading = isLoading || !(token && market)
  const marketSpecifics = isLoading
    ? undefined
    : getMarketSpecificsByMarketName(market.name)
  const { tokenIconURL, isLoading: isTokenIconLoading } = useTokenIconURL({
    marketSpecifics,
    tokenName: token.name,
  })
  const { resolvedTheme } = useThemeMode()
  const tokenPrice = isLoading
    ? ''
    : web3BNToFloatString(
        calculateCurrentPriceBN(
          token.rawSupply,
          market.rawBaseCost,
          market.rawPriceRise,
          market.rawHatchTokens
        ),
        bigNumberTenPow18,
        2
      )
  return (
    <div
      className={classNames(
        'relative border-gray-400 rounded text-brand-gray-2 border',
        classes,
        enabled && 'hover:shadow-xl hover:border-very-dark-blue cursor-pointer'
      )}
    >
      <div className="flex justify-center mt-5">
        {loading || isTokenIconLoading ? (
          <div className="bg-gray-400 rounded-full w-18 h-18 animate animate-pulse"></div>
        ) : (
          <div className="relative w-full h-full rounded-full max-w-18 max-h-18">
            <Image
              src={tokenIconURL || '/gray.svg'}
              alt="token"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
        )}
      </div>
      <div className="mt-1 text-4xl font-semibold text-center">
        {loading ? (
          <div className="w-64 mx-auto bg-gray-400 rounded animate animate-pulse">
            <span className="invisible">A</span>
          </div>
        ) : (
          token.name
        )}
      </div>
      <div className="flex items-center justify-center mt-1 text-xs italic">
        {loading ? (
          <div
            className="w-32 mx-auto bg-gray-400 rounded animate animate-pulse"
            style={{ height: '20px' }}
          ></div>
        ) : (
          <>
            <div>on</div>
            <div className="ml-2.5 mr-1">
              {marketSpecifics.getMarketSVGTheme(resolvedTheme)}
            </div>
            <div>{market.name}</div>
          </>
        )}
      </div>
      <div className="text-3xl mt-7.5 text-center flex justify-center bg-very-dark-blue py-5 text-gray-300">
        <div>
          {loading ? (
            <div className="bg-gray-400 rounded animate animate-pulse">
              <span className="invisible">$$$$$$$$$$$$</span>
            </div>
          ) : (
            <span title={'$' + tokenPrice} className="uppercase">
              ${formatNumber(tokenPrice)}
            </span>
          )}
          {isLoading ? (
            ''
          ) : (
            <span>
              &nbsp;(
              <span
                className={classNames(
                  'uppercase',
                  parseFloat(token.dayChange) < 0
                    ? 'text-brand-red'
                    : 'text-brand-green'
                )}
                title={
                  (parseFloat(token.dayChange) >= 0.0 ? '+' : '') +
                  token.dayChange +
                  '%'
                }
              >
                {!isLoading &&
                  (parseFloat(token.dayChange) >= 0.0 ? '+' : '') +
                    formatNumber(token.dayChange) +
                    '%'}
              </span>
              )
            </span>
          )}
        </div>
      </div>
      <div className="mt-5">
        <br />
        <br />
        <br />
      </div>
      <div className="absolute top-0 right-0 mt-2 mr-2">
        {isLoading ? (
          <div className="w-5 h-5 bg-gray-400 rounded animate animate-pulse"></div>
        ) : (
          <WatchingStar token={token} />
        )}
      </div>
    </div>
  )
}
