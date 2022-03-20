import { gql } from 'graphql-request'

export default function getQuerySinglePricePoint(
  tokenAddress: string,
  fromTs: number
): string {
  return gql`
    {
        ideaTokenPricePoints(first:1, orderBy:"timestamp", orderDirection:"asc", where:{timestamp_gt:"${fromTs}", token:"${tokenAddress}"}) {
            counter
            timestamp
            oldPrice
            price
        }
    }`
}
