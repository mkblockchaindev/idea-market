type Props = {
  tokenName: string
  marketName: string
  wikiSnapshot: any
}

const WikiMobileRelatedInfo = ({
  tokenName,
  marketName,
  wikiSnapshot,
}: Props) => {
  return (
    <>
      <div className="flex md:hidden h-full">
        <div className="w-full">
          {wikiSnapshot?.type === 'wikipedia' && (
            <iframe
              id="wiki-iframe"
              src={wikiSnapshot.url}
              key="wiki-iframe-mobile"
              title="wiki-iframe-mobile"
              className="w-full"
            />
          )}

          {wikiSnapshot?.type === 'local' && (
            <iframe
              id="wiki-iframe"
              src={`https://docs.google.com/gview?embedded=true&url=${wikiSnapshot.url}#toolbar=0&navpanes=0&scrollbar=0`}
              // type="application/pdf"
              title="wiki-iframe-mobile"
              className="w-full"
            />
          )}
        </div>
        {/* <div
          className={classNames(
            relatedOrWiki === 'related' ? 'visible' : 'hidden',
            'w-full'
          )}
        >
          <MutualTokensList tokenName={tokenName} marketName={marketName} />
        </div> */}
      </div>
    </>
  )
}

export default WikiMobileRelatedInfo
