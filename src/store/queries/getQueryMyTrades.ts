import { gql } from 'graphql-request'

export default function getQueryMyTrades({
  ownerAddress,
  first,
  skip,
}: {
  ownerAddress: string
  first: number
  skip: number
}) {
  return gql`
    {
      ideaTokenTrades(first: ${first}, skip: ${skip}, where:{owner:${
    '"' + ownerAddress.toLowerCase() + '"'
  }}) {
        id
        token {
          id
          tokenID
          name
          supply
          holders
          marketCap
          tokenOwner
          daiInToken
          invested
          listedAt
          dayChange
          market {
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
        ideaTokenAmount
        owner
        isBuy
        timestamp
        ideaTokenAmount
        daiAmount
      }
    }`
}
