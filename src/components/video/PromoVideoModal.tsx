import { useState, useEffect } from 'react'
import { useWindowSize } from '../../utils'
import { Modal } from '..'

export default function PromoVideoModal({ close }: { close: () => void }) {
  const windowSize = useWindowSize()
  const [playerSize, setPlayerSize] = useState({ width: '0px', height: '0px' })

  useEffect(() => {
    let { width, height } = windowSize

    if (width === 0) {
      return
    }

    if (width > 500) {
      width = width * 0.5
    } else {
      width = width * 0.9
    }

    // Max width is 1100px
    if (width > 1100) {
      width = 1100
    }

    height = width * 0.75

    setPlayerSize({
      width: width.toString() + 'px',
      height: height.toString() + 'px',
    })
  }, [windowSize])

  return (
    <Modal close={close}>
      <div style={playerSize}>
        <iframe
          title="promo-iframe"
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/vmzUtpaeQ-I"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </Modal>
  )
}
