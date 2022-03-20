type Props = {
  rawTokenName: string
  tokenName: string
  marketName: string
}

const DesktopRelatedInfo = ({ rawTokenName, tokenName, marketName }: Props) => {
  return (
    <div className="hidden md:flex">
      <div className="w-full">
        <div style={{ height: '450px', overflowY: 'scroll', zIndex: '-20' }}>
          <a
            className="twitter-timeline"
            href={`https://twitter.com/${rawTokenName}`}
            data-chrome="noheader nofooter"
          >
            No tweets found for {tokenName}
          </a>
        </div>
      </div>
      {/* <div className="w-1/2 ml-5">
        <MutualTokensList tokenName={tokenName} marketName={marketName} />
      </div> */}
    </div>
  )
}

export default DesktopRelatedInfo
