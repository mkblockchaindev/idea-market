import Modal from '../modals/Modal'
import dynamic from 'next/dynamic'

const NoSSRWalletInterface = dynamic(() => import('./WalletInterface'), {
  ssr: false,
})

export default function WalletModal({ close }: { close: () => void }) {
  return (
    <Modal close={close}>
      <div className="p-4 bg-top-mobile">
        <p className="text-2xl text-center text-gray-300 md:text-3xl font-gilroy-bold">
          {' '}
          Payment Method
        </p>
      </div>
      <NoSSRWalletInterface onWalletConnected={close} />
    </Modal>
  )
}
