import { GlobalContext } from './GlobalContext'
import { useContext, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getCookie } from 'services/CookieService'
import useAuth from 'components/account/useAuth'

export const ClientWrapper: React.FC = ({ children }) => {
  const { active, account } = useWeb3React()
  const { setJwtToken, setUser } = useContext(GlobalContext)

  const { setUserFromJwt } = useAuth()

  useEffect(() => {
    const initUserData = () => {
      // List of wallet address <-> JWT pairs (named t)
      const jwtKeyValues = JSON.parse(getCookie('t')) || {}
      const jwt = jwtKeyValues[account]

      if (jwt) {
        setJwtToken(jwt)
        setUserFromJwt(jwt)
      } else {
        setJwtToken(null)
        setUser({})
      }
    }

    initUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, account])

  return <>{children}</>
}
