import classNames from 'classnames'
import { useQuery } from 'react-query'
import { IdeaTokenMarketPair, queryTokensHeld } from 'store/ideaMarketsStore'
import { useWalletStore } from 'store/walletStore'
import { formatNumber } from 'utils'
import L1TokenTableRow from './L1TokenTableRow'

type Header = {
  title: string
  value: string
}

const headers: Header[] = [
  {
    title: '',
    value: 'market',
  },
  {
    title: 'Name',
    value: 'name',
  },
  {
    title: 'Balance',
    value: 'balance',
  },
]

export default function L1TokenTable({
  setSelectedPair,
}: {
  setSelectedPair: (pair: IdeaTokenMarketPair) => void
}) {
  const address = useWalletStore((state) => state.address)

  const { data: rawPairs, isLoading } = useQuery(
    ['l1-tokens', address],
    queryTokensHeld
  )

  if (!rawPairs) {
    return <></>
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="hidden md:table-header-group">
                  <tr>
                    {headers.map((header) => (
                      <th
                        className={classNames(
                          'px-5 py-4 text-sm font-semibold leading-4 tracking-wider text-left text-brand-gray-4 bg-gray-50'
                        )}
                        style={{ backgroundColor: '#f9fbfd' }}
                        key={header.value}
                      >
                        {header.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    'loading'
                  ) : (
                    <>
                      {rawPairs.map((pair) => (
                        <L1TokenTableRow
                          key={
                            pair.token.tokenID.toString() +
                            '-' +
                            pair.market.marketID.toString()
                          }
                          pair={pair}
                          balance={formatNumber(pair.balance)}
                          setSelectedPair={setSelectedPair}
                        />
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
