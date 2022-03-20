import { useEffect, useState } from 'react'
import { queryENS } from 'store/ensStore'

export function useENSAddress(recipientAddress: string) {
  const [hexAddress, setHexAddress] = useState('0')
  const [isLoading, setIsLoading] = useState(true)

  useEffect((): any => {
    async function run() {
      try {
        setHexAddress(await queryENS(recipientAddress))
      } catch (e) {
        setHexAddress('0')
      }
    }

    setIsLoading(true)
    run()

    setIsLoading(false)
  }, [recipientAddress])

  // First return value says if is valid ENS address or not
  return [parseInt(hexAddress, 16) !== 0, hexAddress, isLoading]
}
