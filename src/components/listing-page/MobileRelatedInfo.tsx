type Props = {
  rawTokenName: string
  tokenName: string
  marketName: string
}

const MobileRelatedInfo = ({ rawTokenName, tokenName, marketName }: Props) => {
  return (
    <>
      <div className="flex md:hidden h-full">
        <div className="w-full h-full overflow-y-auto">
          <a
            className="twitter-timeline h-full"
            href={`https://twitter.com/${rawTokenName}`}
          >
            No tweets found for {tokenName}
          </a>
        </div>
        {/* <div
          className={classNames(
            relatedOrTweets === 'related' ? 'visible' : 'hidden',
            'w-full'
          )}
        >
          <MutualTokensList tokenName={tokenName} marketName={marketName} />
        </div> */}
      </div>
    </>
  )
}

export default MobileRelatedInfo
