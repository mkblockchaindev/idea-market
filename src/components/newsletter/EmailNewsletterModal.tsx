import { Modal } from '..'

export default function EmailNewsletterModal({ close }: { close: () => void }) {
  return (
    <Modal close={close}>
      <div className="mb-5 w-100 max-w-100">
        <div className="p-4 bg-top-mobile">
          <p className="text-2xl text-center text-gray-300 md:text-3xl font-gilroy-bold">
            Notifications
          </p>
        </div>
        <div className="flex justify-center">
          <iframe
            title="embed"
            src="https://ideamarkets.substack.com/embed"
            width="350"
            height="320"
            style={{ border: '1px solid #EEE', backgroundColor: 'white' }}
            frameBorder="0"
            scrolling="no"
          />
        </div>
      </div>
    </Modal>
  )
}
