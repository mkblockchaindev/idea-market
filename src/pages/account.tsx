import { DefaultLayout } from 'components'
import { ReactElement } from 'react'
import { Toaster } from 'react-hot-toast'
import { ProfileWallet } from 'components/account'
import ProfileGeneralInfo from 'components/account/ProfileGeneralInfo'

const Account = () => {
  return (
    <div className="min-h-screen bg-brand-gray dark:bg-gray-900 font-inter">
      <div className="h-full px-4 pt-8 pb-5 text-white md:px-6 md:pt-16 bg-top-mobile md:bg-top-desktop md:h-[38rem]">
        <div className="mx-auto md:px-4 max-w-88 md:max-w-304">
          <Toaster />
          <ProfileGeneralInfo />
          <ProfileWallet walletState="signedOut" />
        </div>
      </div>
    </div>
  )
}

export default Account

Account.getLayout = (page: ReactElement) => (
  <DefaultLayout>{page}</DefaultLayout>
)
