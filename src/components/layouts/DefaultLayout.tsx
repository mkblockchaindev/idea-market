import { ReactNode, useEffect } from 'react'
import CookieConsent from 'react-cookie-consent'
import { Toaster } from 'react-hot-toast'

import { initIdeaMarketsStore } from 'store/ideaMarketsStore'
import { initTokenList } from 'store/tokenListStore'
import NavMenu from 'components/nav-menu/NavMenu'
import classNames from 'classnames'

type Props = {
  children: ReactNode
  bgColor?: string // Can style background color of page different from default (needs to be Tailwind bg color)
}

export default function DefaultLayout({ children, bgColor }: Props) {
  // const router = useRouter()
  // const { isEmailFooterActive } = useContext(GlobalContext)

  useEffect(() => {
    initIdeaMarketsStore()
    initTokenList()
  }, [])

  return (
    <div
      className={classNames(
        bgColor ? bgColor : 'bg-brand-gray dark:bg-gray-900',
        'min-h-screen'
      )}
    >
      <Toaster />
      <NavMenu />
      <div className="pt-16">{children}</div>
      <div className="fixed bottom-0 z-20 w-full">
        <CookieConsent
          style={{ position: 'relative', background: '#708090' }}
          buttonStyle={{
            background: '#0857e0',
            color: 'white',
            fontSize: '13px',
          }}
        >
          This website uses cookies to enhance the user experience.
        </CookieConsent>
        {/* {isEmailFooterActive && router.pathname === '/' ? (
          <EmailFooter />
        ) : (
          <></>
        )} */}
      </div>
    </div>
  )
}
