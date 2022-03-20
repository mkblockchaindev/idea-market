import { useState } from 'react'
import { useQuery } from 'react-query'
import {
  MutualHoldersData,
  queryMutualHoldersOfToken,
} from 'store/ideaMarketsStore'
import { MutualToken, MutualTokenSkeleton } from 'components'
import DropDown from 'components/DropDown'
import classNames from 'classnames'

export type MutualTokensListSortBy = 'totalAmount' | 'totalHolders'

const options = [
  {
    value: 'totalHolders',
    label: 'Mutual Holders',
  },
  {
    value: 'totalAmount',
    label: 'Mutual Tokens',
  },
]

export default function MutualTokensList({
  tokenName,
  marketName,
}: {
  tokenName: string
  marketName: string
}) {
  const PAGE_SIZE = 8
  const [pageNumber, setPageNumber] = useState(1)
  const [sortBy, setSortBy] = useState<MutualTokensListSortBy>('totalHolders')

  const {
    data: mutualHoldersList,
    isLoading,
    isError,
  } = useQuery<MutualHoldersData[]>(
    [`token-mutualHolders-${marketName}-${tokenName}`, marketName, tokenName],
    () => queryMutualHoldersOfToken({ marketName, tokenName })
  )

  function sortedMutualHolders() {
    if (isLoading || isError || !mutualHoldersList) {
      return []
    }
    return mutualHoldersList
      .sort((a, b) => Number(b.stats[sortBy]) - Number(a.stats[sortBy]))
      .slice(0, pageNumber * PAGE_SIZE)
  }

  if (isError) {
    return <p>Something went wrong!!!</p>
  }

  return (
    <>
      <div className="md:h-20 pb-5 mb-12 border-b border-gray-200 text-white sm:flex sm:items-end sm:justify-between">
        <h3
          className={classNames(
            'text-2xl font-medium leading-6',
            marketName.toLowerCase() === 'twitter' && 'order-2'
          )}
        >
          Holders also bought
        </h3>
        <div
          className={classNames(
            'mt-3 sm:mt-0',
            marketName.toLowerCase() === 'twitter' && 'order-1'
          )}
        >
          <p>Sort By</p>
          <DropDown
            name="Sort By"
            options={options}
            isDisabled={isLoading}
            isClearable={false}
            defaultValue={options[0]}
            isSearchable={false}
            className="w-48 border-2 border-gray-200 dark:border-gray-500 dark:placeholder-gray-300 rounded-md text-brand-gray-4 dark:text-gray-200 market-select trade-select"
            onChange={(entry) => {
              setSortBy((entry as any).value)
            }}
            formatOptionLabel={null}
          />
        </div>
      </div>

      <dl className={classNames('grid grid-cols-1 gap-10 mt-5')}>
        {isLoading && (
          <>
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
          </>
        )}
        {!isLoading &&
          sortedMutualHolders().map((mutualHolderData) => (
            <MutualToken
              stats={mutualHolderData.stats}
              token={mutualHolderData.token}
              key={mutualHolderData.token.address}
              sortBy={sortBy}
            />
          ))}
        {!isLoading && mutualHoldersList.length === 0 && (
          <p className="text-gray-500">No mutual holders for this token.</p>
        )}
      </dl>

      {!isLoading &&
        mutualHoldersList &&
        pageNumber * PAGE_SIZE < mutualHoldersList.length && (
          <div className="flex items-center justify-center my-10">
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 text-base font-medium bg-white border border-transparent rounded-md shadow-sm text-brand-blue hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Load more
            </button>
          </div>
        )}
    </>
  )
}
