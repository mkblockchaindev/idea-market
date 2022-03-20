import Broken from 'assets/broken-wiki-tokens.json'

/**
 * On launch, a few Wikipedia tokens were created with broken names. This function gets correct names for broken tokens.
 * @param tokenName the raw token name from smart contract
 * @returns the name that it should be. Matches Wikipedia URL
 */
export const getRealTokenName = (tokenName: string) => {
  if (Broken.some((token) => token.brokenName === tokenName)) {
    return Broken.find((token) => token.brokenName === tokenName).realName
  }

  return tokenName
}

/**
 * On launch, a few Wikipedia tokens were created with broken names. This function gets broken names from input name no matter case.
 * @param tokenName the input token name (case does not matter)
 * @returns the broken name stored in contract. Does not match Wikipedia URL
 */
export const getBrokenTokenName = (tokenName: string) => {
  if (
    Broken.some(
      (token) => token.brokenName.toLowerCase() === tokenName.toLowerCase()
    )
  ) {
    return Broken.find(
      (token) => token.brokenName.toLowerCase() === tokenName.toLowerCase()
    ).brokenName
  }

  return null
}
