import { gql } from 'graphql-request'

export default function getQuerySingleTokenByID(
  marketID: string,
  tokenID: string
): string {
  return gql`
    {
      ideaMarkets(where:{marketID:${marketID}}) {
        tokens(where:{tokenID:${tokenID}}) {
            name
            market {
              name
            }
        }
      }
    }`
}
