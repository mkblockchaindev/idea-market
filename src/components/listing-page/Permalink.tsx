import copy from 'copy-to-clipboard'
import toast from 'react-hot-toast'
import { LinkIcon } from '@heroicons/react/outline'
import ClipIcon from '../../assets/clip.svg'
import CopyCheck from '../../assets/copy-check.svg'
import { useEffect, useState } from 'react'

export default function Permalink({ token }) {
  const [isLinkCopyDone, setIsLinkCopyDone] = useState(false)
  const [permanentLink, setPermanentLink] = useState('')

  useEffect(() => {
    if (token) {
      setPermanentLink(
        `https://attn.to/r/L/${parseInt(`${token.marketID}`, 16)}/${
          token.tokenID
        }`
      )
    }
  }, [token])

  return (
    <div className="w-full py-4">
      <label
        htmlFor="perm_link"
        className="block text-sm font-medium text-gray-700"
      >
        Permalink
      </label>
      <div className="flex mt-1 rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <LinkIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="text"
            id="perm_link"
            className="block w-full pl-10 border-gray-300 rounded-none focus:ring-indigo-500 focus:border-indigo-500 rounded-l-md sm:text-sm text-brand-new-dark dark:bg-gray-500 dark:text-gray-300"
            defaultValue={permanentLink}
            disabled={true}
          />
        </div>
        <button
          className="relative inline-flex items-center px-4 py-2 -ml-px space-x-2 text-sm font-medium text-gray-700 dark:bg-gray-500 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          onClick={() => {
            copy(permanentLink)
            toast.success('Copied the listing permanent link.')
            setIsLinkCopyDone(true)
            setTimeout(() => {
              setIsLinkCopyDone(false)
            }, 2000)
          }}
        >
          {isLinkCopyDone ? (
            <CopyCheck className="text-[#0857E0] dark:text-blue-400 w-[22px] h-[22px]" />
          ) : (
            <ClipIcon className="w-5 h-5 dark:text-blue-400" />
          )}

          <span className="sr-only">Copy</span>
        </button>
      </div>
    </div>
  )
}
