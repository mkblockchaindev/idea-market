/**
 * Get the contract defined market for this URL
 */
export const getMarketFromURL = (url: string, markets: any[]) => {
  if (!url || url === '') return null

  let marketName = 'URL'
  // TODO: when there is time, make this parsing more accurate. Tons of issues right now

  const twitterURLs = ['https://twitter.com/', 'https://www.twitter.com/']
  if (twitterURLs.includes(url))
    return markets?.find((m) => m.market.name === 'URL')?.market

  if (url.includes('twitter.com/')) {
    // TODO: make sure 21 will not cause bug
    const afterDomain = url.substring(21, url.length)
    if (!afterDomain.includes('/')) {
      // It is twitter market if no more slashes
      marketName = 'Twitter'
    } else {
      const indexOfSlash = afterDomain.indexOf('/')
      // This is "/" and any text after that slash
      const textAfterSlash = afterDomain.substring(indexOfSlash, url.length)
      // If there is no slash or if there is just a slash at end of URL, then it is valid Twitter market
      if (indexOfSlash === -1 || textAfterSlash?.length === 1) {
        marketName = 'Twitter'
      }
    }
  } else if (url.includes('wikipedia.org/wiki/')) {
    marketName = 'Wikipedia'
  } else if (url.includes('minds.com/')) {
    marketName = 'Minds'
  } else if (url.includes('tryshowtime.com/')) {
    marketName = 'Showtime'
  } else if (url.includes('.substack.com')) {
    const afterDomain = url.substring(12, url.length)
    // If we see another slash, this means it is not Substack account (unless it is discover link like this: https://teganandsara.substack.com/?utm_source=discover)
    if (afterDomain.includes('/?') || !afterDomain.includes('/')) {
      marketName = 'Substack'
    } else {
      const indexOfSlash = afterDomain.indexOf('/')
      // This is "/" and any text after that slash
      const textAfterSlash = afterDomain.substring(indexOfSlash, url.length)
      // If there is no slash or if there is just a slash at end of URL, then it is valid Twitter market
      if (indexOfSlash === -1 || textAfterSlash?.length === 1) {
        marketName = 'Substack'
      }
    }
  }

  const urlMarket = markets?.find((m) => m.market.name === marketName)
  return urlMarket?.market
}
