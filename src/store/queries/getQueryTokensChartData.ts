import { gql } from 'graphql-request'

export default function getQueryTokensChartData(
  tokenAddresses: string[],
  ids: number[][]
): string {
  return gql`
    {
        ${tokenAddresses
          .map((address, index) => {
            const i = ids[index]
            if (i.length === 0) {
              return ''
            } else {
              return `
                a${address}:ideaTokenPricePoints(first:${
                i.length
              },orderBy:"timestamp", orderDirection:"asc", where:{token:"${address}", counter_in:[${i.join(
                ','
              )}]}) {
                    counter
                    timestamp
                    oldPrice
                    price
                }`
            }
          })
          .join('\n')}
    }`
}
