import { gql } from 'graphql-request'

export default function getQueryMarket(marketName: string): string {
  return gql`{
      ideaMarkets(where:{name:${'"' + marketName + '"'}}) {
        marketID
        name
        baseCost
        priceRise
        hatchTokens
        tradingFeeRate
        platformFeeRate
        platformOwner
        platformFeeInvested
        platformFeeRedeemed
        platformInterestRedeemed
        nameVerifier
      }
    }`
}
