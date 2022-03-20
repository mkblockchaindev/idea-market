import { gql } from 'graphql-request'

export default function getQueryTokenLockedChartData(
  tokenAddress: string,
  toTs: number
): string {
  const now = Math.floor(Date.now() / 1000)
  return gql`
    {
      lockedIdeaTokenAmounts(where:{token:${
        '"' + tokenAddress + '"'
      },lockedUntil_gt:${now},lockedUntil_lt:${toTs}}) {
        amount
        lockedUntil
      }
    }`
}
