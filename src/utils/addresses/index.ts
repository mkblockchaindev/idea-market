import Web3 from 'web3'

/**
 * https://web3js.readthedocs.io/en/v1.2.11/web3-utils.html#tochecksumaddress
 * Will throw an exception if invalid ETH address
 */
export function toChecksumedAddress(addr: string): string {
  const web3 = new Web3()
  return web3.utils.toChecksumAddress(addr)
}

/**
 * @param addr -- The ETH address. It can be upper-case, lower-case, or both
 * @returns true if it is ETH address and false otherwise
 */
export function isETHAddress(addr: string): boolean {
  try {
    toChecksumedAddress(addr)
    return true
  } catch (e) {
    return false
  }
}
