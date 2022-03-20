import { EmailForm, Footer } from 'components'
import Image from 'next/image'

const BackSoon = () => {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-maintenance">
      <div className="relative flex flex-col items-center justify-center w-3/4 h-3/4 md:h-3/5 bg-white rounded-lg text-center">
        <div className="relative w-48 md:w-56 h-48 md:h-56">
          <Image
            src="/logo.png"
            alt="Workflow logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <span className="text-2xl md:text-6xl font-bold text-brand-navy mt-3">
          We’ll be back in a few hours.
        </span>
        <span className="text-xl md:text-3xl italic font-light text-brand-navy mb-2 md:mb-6 mt-10 md:mt-12">
          Sign up here to get notified:
        </span>
        <EmailForm isMaintenance={true} />
        <span className="mb-4 md:mb-12"></span>
        <div className="absolute w-5/6 h-5/6">
          <Image
            src="/MaintenancePanelBg.svg"
            alt="Workflow logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <div className="w-3/4 md:mt-16 text-white">
        <Footer />
      </div>
    </div>
  )
}

export default BackSoon
