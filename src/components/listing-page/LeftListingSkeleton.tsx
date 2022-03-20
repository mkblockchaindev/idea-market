import { ZERO_ADDRESS } from 'utils'

export function LeftListingSkeleton({ token }) {
  return (
    <>
      {token.tokenOwner === ZERO_ADDRESS ? (
        <>
          <div className="flex flex-col items-center">
            <span className="text-xl">Claimable interest</span>
            <div className="w-32 h-8 bg-gray-400 rounded animate animate-pulse mt-2"></div>
            <div className="w-64 h-12 bg-gray-400 rounded animate animate-pulse mt-5"></div>
          </div>
          <div className="w-6 h-6 absolute top-0 right-0 bg-gray-400 rounded-lg animate animate-pulse"></div>
        </>
      ) : (
        <div className="inline-block">
          <div className="text-sm font-semibold text-brand-new-dark">
            Listing Owner
          </div>
          <div className="w-24 h-6 mt-2 bg-gray-400 rounded animate animate-pulse"></div>
          <div className="w-64 h-20 bg-gray-400 rounded animate animate-pulse mt-5"></div>
          <div className="w-6 h-6 absolute top-0 right-0 bg-gray-400 rounded-lg animate animate-pulse"></div>
        </div>
      )}
    </>
  )
}
