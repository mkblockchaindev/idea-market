import { gql } from 'graphql-request'

export default async function getQueryMarkets(
  marketNames: string[]
): Promise<string> {
  const inMarkets = marketNames.map((name) => `"${name}"`).join(',')
  // Need to use outMarkets because empty query will fetch all markets, despite feature switches
  const where =
    marketNames.length === 0 ? '' : `(where:{name_in:[${inMarkets}]})`
  return gql`
    {
      ideaMarkets${where} {
        marketID
        name
        baseCost
        priceRise
        hatchTokens
        tradingFeeRate
        platformFeeRate
        platformOwner
        platformFeeInvested
        nameVerifier
      }
    }
  `
}
