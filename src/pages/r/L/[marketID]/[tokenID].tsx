import { GetServerSideProps } from 'next'
import { getMarketSpecificsByMarketName } from 'store/markets'
import { querySingleTokenByID } from 'store/ideaMarketsStore'

export default function RedirectToTokenDetails() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { marketID, tokenID } = context.params

  const response = await querySingleTokenByID(
    `token-${marketID}-${tokenID}`,
    marketID.toString(),
    tokenID.toString()
  )

  const marketSpecifics = getMarketSpecificsByMarketName(response.marketName)
  const marketName = marketSpecifics.getMarketNameURLRepresentation()
  const tokenName = marketSpecifics.getTokenNameURLRepresentation(response.name)

  return {
    redirect: {
      destination: `/i/${marketName}/${tokenName}`,
      permanent: true,
    },
  }
}
