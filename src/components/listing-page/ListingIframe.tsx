import copy from 'copy-to-clipboard'
import { IframeEmbedSkeleton } from 'pages/iframe/[marketName]/[tokenName]'
import { useState } from 'react'
import toast from 'react-hot-toast'
import CopyCheck from '../../assets/copy-check.svg'
import CopyIcon from '../../assets/copy-icon.svg'

export default function ListingIframe({ rawMarketName, rawTokenName }) {
  const embedCode = `<iframe src="https://ideamarket.io/iframe/${rawMarketName}/${rawTokenName}" title="Ideamarket Embed" style="width: 400px; height: 75px;"`
  const [isEmbedCopyDone, setIsEmbedCopyDone] = useState(false)
  const [showEmbedSkeleton, setShowEmbedSkeleton] = useState(true)

  return (
    <div className="relative h-24 mt-4">
      <div className="flex items-center space-x-1">
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Embed
        </p>
        <button
          onClick={() => {
            copy(embedCode)
            toast.success('Copied the embed code')
            setIsEmbedCopyDone(true)
            setTimeout(() => {
              setIsEmbedCopyDone(false)
            }, 2000)
          }}
        >
          {isEmbedCopyDone ? (
            <CopyCheck className="w-4 h-4 text-gray-400 dark:text-gray-300" />
          ) : (
            <CopyIcon className="w-4 h-4 text-gray-400 dark:text-gray-300" />
          )}
        </button>
      </div>

      <div
        className="-ml-2 overflow-x-auto cursor-pointer"
        onClick={() => {
          copy(embedCode)
          toast.success('Copied the embed code')
          setIsEmbedCopyDone(true)
          setTimeout(() => {
            setIsEmbedCopyDone(false)
          }, 2000)
        }}
      >
        {showEmbedSkeleton && (
          <div
            style={{
              width: '700px',
              transform: 'scale(0.5)',
              transformOrigin: 'top left',
            }}
            className="mt-3"
          >
            <IframeEmbedSkeleton />
          </div>
        )}
        <iframe
          className={showEmbedSkeleton ? 'invisible' : 'visible'}
          src={`/iframe/${rawMarketName}/${rawTokenName}`}
          title="Ideamarket Embed"
          id="frame"
          style={{
            width: '400px',
            height: '75px',
            pointerEvents: 'none',
          }}
          onLoad={() => {
            setShowEmbedSkeleton(false)
          }}
        />
      </div>
    </div>
  )
}
