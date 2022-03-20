import { gql } from 'graphql-request'

export default function getQueryTokenChartData(
  tokenAddress: string,
  ids: number[]
): string {
  return gql`
    {
        ideaTokenPricePoints(first:${
          ids.length
        },orderBy:"timestamp", orderDirection:"asc", where:{token:"${tokenAddress}", counter_in:[${ids.join(
    ','
  )}]}) {
            counter
            timestamp
            oldPrice
            price
        }
    }`
}
