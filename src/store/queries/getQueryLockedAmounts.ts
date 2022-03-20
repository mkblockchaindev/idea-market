import { gql } from 'graphql-request'

export default function getQueryLockedAmounts(
  tokenAddress: string,
  ownerAddress: string,
  skip: number,
  num: number,
  orderBy: string,
  orderDirection: string
) {
  return gql`
    {
      lockedIdeaTokenAmounts(skip:${skip}, first:${num}, orderBy:${orderBy}, orderDirection:${orderDirection}, where:{token:${
    '"' + tokenAddress + '"'
  }, owner:${'"' + ownerAddress + '"'}}) {
        amount
        lockedUntil
      }
    }`
}
