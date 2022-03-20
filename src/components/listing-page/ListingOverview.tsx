import { IdeaMarket, IdeaToken } from 'store/ideaMarketsStore'
import { getMarketSpecificsByMarketName } from 'store/markets'
import classNames from 'classnames'
import {
  bigNumberTenPow18,
  calculateCurrentPriceBN,
  formatNumber,
  formatNumberInt,
  formatNumberWithCommasAsThousandsSerperator,
  web3BNToFloatString,
} from '../../utils'
import A from 'components/A'
import { useTokenIconURL } from 'actions'
import IdeaverifyIconBlue from '../../assets/IdeaverifyIconBlue.svg'
import Image from 'next/image'
import { useWeb3React } from '@web3-react/core'
import ModalService from 'components/modals/ModalService'
import { VerifyModal } from 'components'
import { useMixPanel } from 'utils/mixPanel'
import WatchingStar from 'components/WatchingStar'

function DetailsSkeleton() {
  return (
    <div className="w-12 mx-auto bg-gray-400 rounded animate animate-pulse">
      <span className="invisible">A</span>
    </div>
  )
}

function DetailsOverChartEntry({
  header,
  children,
  contentTitle,
  customClasses,
}: {
  header: JSX.Element | string
  children: JSX.Element
  contentTitle?: string
  customClasses?: string
}) {
  return (
    <div className={classNames('text-center p-2 pt-6 md:pt-2', customClasses)}>
      <div className="mb-1 text-base font-medium text-brand-gray text-opacity-60">
        {header}
      </div>
      <div className="text-2xl font-medium uppercase" title={contentTitle}>
        {children}
      </div>
    </div>
  )
}

export default function TokenCard({
  token,
  market,
  isLoading,
  refetch,
}: {
  token: IdeaToken
  market: IdeaMarket
  isLoading?: boolean
  refetch: () => any
}) {
  const { account } = useWeb3React()
  const loading = isLoading || !(token && market)
  const marketSpecifics = isLoading
    ? undefined
    : getMarketSpecificsByMarketName(market.name)
  const { tokenIconURL, isLoading: isTokenIconLoading } = useTokenIconURL({
    marketSpecifics,
    tokenName: token.name,
  })
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

  const { mixpanel } = useMixPanel()

  const onVerifyClicked = () => {
    mixpanel.track('CLAIM_INCOME_STREAM', {
      token: token.name,
      market: market.name,
    })

    const onClose = () => refetch()
    ModalService.open(VerifyModal, { market, token }, onClose)
  }

  return (
    <>
      <div className="flex mt-7">
        <div className="relative w-20 h-20 mr-5">
          {loading || isTokenIconLoading ? (
            <div className="bg-gray-400 rounded-full w-18 h-18 animate animate-pulse"></div>
          ) : (
            <Image
              className="rounded-full"
              src={tokenIconURL || '/gray.svg'}
              alt=""
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
        <div className="mt-1 text-2xl font-semibold text-brand-alto">
          {loading ? (
            <div className="w-64 mx-auto bg-gray-400 rounded animate animate-pulse">
              <span className="invisible">A</span>
            </div>
          ) : (
            <div className="flex">
              <span className="align-middle">
                <A
                  href={`${marketSpecifics.getTokenURL(token.name)}`}
                  className="hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  {marketSpecifics.getTokenDisplayName(token.name)}
                </A>
              </span>
              <span className="hidden md:block ml-2.5 mr-1 w-5 h-5">
                {marketSpecifics.getMarketSVGWhite()}
              </span>
              {token?.verified && (
                <span className="hidden md:block inline w-6 h-6 ml-1.5">
                  <IdeaverifyIconBlue className="w-6 h-6" />
                </span>
              )}
            </div>
          )}
          {loading ? (
            <div className="w-32 mx-auto bg-gray-400 rounded animate animate-pulse">
              <span className="invisible">A</span>
            </div>
          ) : (
            <div className="flex mt-1 text-sm items-baseline md:items-start">
              <div>Rank {token.rank ? token.rank : '-'}</div>
              <div className="hidden md:block md:relative w-5 ml-4">
                <WatchingStar
                  className="absolute top-0 right-0"
                  token={token}
                />
              </div>
              <span className="block md:hidden ml-2.5 mr-1 w-5 h-5">
                {marketSpecifics.getMarketSVGWhite()}
              </span>
              {token?.verified && (
                <span className="block md:hidden inline w-6 h-6 ml-1.5">
                  <IdeaverifyIconBlue className="w-6 h-6" />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {market?.name === 'Twitter' && (
        <div className="w-full md:w-auto text-center my-2">
          {account &&
            token?.verified &&
            token.tokenOwner.toLowerCase() === account.toLowerCase() && (
              <span>Verified by you</span>
            )}

          {!token?.verified && (
            <button
              onClick={onVerifyClicked}
              className="py-2 text-lg font-bold text-white border border-white rounded-lg w-44 font-sf-compact-medium hover:bg-white hover:text-brand-blue"
            >
              Verify ownership
            </button>
          )}
        </div>
      )}
      <div>
        <div className="grid grid-cols-3 p-1 mb-1 md:grid-cols-6">
          <DetailsOverChartEntry header="Price" contentTitle={'$' + tokenPrice}>
            {isLoading ? (
              <DetailsSkeleton />
            ) : (
              <>{'$' + formatNumber(tokenPrice)}</>
            )}
          </DetailsOverChartEntry>

          <DetailsOverChartEntry
            header="Deposits"
            contentTitle={'$' + token.marketCap}
          >
            {isLoading ? (
              <DetailsSkeleton />
            ) : parseFloat(token.marketCap) <= 0.0 ? (
              <>&mdash;</>
            ) : (
              <>{`$${formatNumberWithCommasAsThousandsSerperator(
                parseInt(token.marketCap)
              )}`}</>
            )}
          </DetailsOverChartEntry>

          <DetailsOverChartEntry
            header="Supply"
            contentTitle={'$' + token.supply}
          >
            {isLoading ? (
              <DetailsSkeleton />
            ) : parseFloat(token.supply) <= 0.0 ? (
              <>&mdash;</>
            ) : (
              <>{`${formatNumberWithCommasAsThousandsSerperator(
                parseInt(token.supply)
              )}`}</>
            )}
          </DetailsOverChartEntry>

          <DetailsOverChartEntry
            header="Holders"
            contentTitle={formatNumberInt(token.holders)}
          >
            {isLoading ? (
              <DetailsSkeleton />
            ) : (
              <>{formatNumberInt(token.holders)}</>
            )}
          </DetailsOverChartEntry>
          <DetailsOverChartEntry
            header="24H Volume"
            contentTitle={'$' + token.dayVolume}
          >
            {isLoading ? (
              <DetailsSkeleton />
            ) : (
              <>{`$${formatNumber(token.dayVolume)}`}</>
            )}
          </DetailsOverChartEntry>
          <DetailsOverChartEntry
            header="24H Change"
            customClasses="pr-0"
            contentTitle={token.dayChange + '%'}
          >
            {isLoading ? (
              <DetailsSkeleton />
            ) : (
              <div
                className={
                  parseFloat(token.dayChange) >= 0.0
                    ? 'text-brand-neon-green dark:text-green-400'
                    : 'text-brand-red dark:text-red-500'
                }
              >
                {formatNumber(token.dayChange)}%
              </div>
            )}
          </DetailsOverChartEntry>
        </div>
      </div>
    </>
  )
}
