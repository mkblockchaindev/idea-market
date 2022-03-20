import { NextSeo } from 'next-seo'
import { getURL } from 'utils/seo-constants'

export default function ListingSEO({ tokenName, rawMarketName, rawTokenName }) {
  return (
    <NextSeo
      title={tokenName}
      canonical={`https://ideamarket.io/i/${rawMarketName}/${rawTokenName}`}
      openGraph={{
        url: `https://ideamarket.io/i/${rawMarketName}/${rawTokenName}`,
        images: [
          {
            url: `${
              process.env.NEXT_PUBLIC_OG_IMAGE_URL ?? getURL()
            }/api/${rawMarketName}/${rawTokenName}.png`,
          },
        ],
      }}
    />
  )
}
