import { getValidURL } from 'actions/web2/getValidURL'
import { GetServerSideProps } from 'next'
import { queryMarkets, querySingleToken } from 'store/ideaMarketsStore'
import { getMarketSpecificsByMarketNameInURLRepresentation } from 'store/markets'

const ListingPage = () => {
  return null
}

/**
 * This is page for redirecting old URL format to new URL format for listing page.
 * It's confusing because tokenId is actually marketName in this file.
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tokenId: marketName, tokenName } = context.params as any

  // Get tokenName in contract format
  const contractTokenName =
    getMarketSpecificsByMarketNameInURLRepresentation(
      marketName
    ).getTokenNameFromURLRepresentation(tokenName)

  // Get badly parsed URL (not canonical)
  const badURL =
    getMarketSpecificsByMarketNameInURLRepresentation(marketName).getTokenURL(
      contractTokenName
    )

  try {
    const canonical = await getValidURL(badURL)

    const markets = await queryMarkets('all-markets')
    const marketID = markets.find(
      (market) => market.name.toLowerCase() === marketName?.toLowerCase()
    ).marketID

    const existingListing = await querySingleToken(
      canonical,
      contractTokenName,
      marketID
    )

    const listingId = existingListing?.listingId

    return {
      redirect: {
        destination: `/i/${listingId}`,
        permanent: true,
      },
    }
  } catch (error) {
    return {
      redirect: {
        destination: `/`,
        permanent: true,
      },
    }
  }
}

export default ListingPage
