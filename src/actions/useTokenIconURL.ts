import { useEffect, useState } from 'react'
import { IMarketSpecifics } from '../store/markets'

export default function useTokenIconURL({
  marketSpecifics,
  tokenName,
}: {
  marketSpecifics: IMarketSpecifics
  tokenName: string
}) {
  const [tokenIconURL, setTokenIconURL] = useState('/gray.svg')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isCancelled = false
    if (tokenName && marketSpecifics) {
      setIsLoading(true)
      marketSpecifics.getTokenIconURL(tokenName).then((url) => {
        if (!isCancelled) {
          setTokenIconURL(url)
        }
        setIsLoading(false)
      })
    }
    return () => {
      isCancelled = true
    }
  }, [marketSpecifics, tokenName])

  return { tokenIconURL, isLoading }
}
