import router from 'next/router'
import { AIRDROP_TYPES } from 'types/airdropTypes'

export const getNavbarConfig = (mixPanel: any) => ({
  menu: [
    {
      name: 'Start',
      subMenu: [
        {
          name: 'User Tutorial',
          onClick: () => {
            window.open(
              'https://docs.ideamarket.io/user-guide/tutorial',
              '_blank'
            )
            mixPanel.track('LINK_TUTORIAL')
          },
        },
        {
          name: 'Whitepaper',
          onClick: () => {
            window.open('https://docs.ideamarket.io/', '_blank')
            mixPanel.track('LINK_WHITEPAPER')
          },
        },
        {
          name: 'Buy Arb-ETH with credit/debit',
          onClick: () => {
            window.open('https://arbitrum.banxa.com', '_blank')
            mixPanel.track('LINK_BUY_ARB_ETH')
          },
        },
        // {
        //   name: 'Browser Extension',
        //   onClick: () => {
        //     window.open(
        //       'https://chrome.google.com/webstore/detail/ideamarket/hgpemhabnkecancnpcdilfojngkoahei',
        //       '_blank'
        //     )
        //     mixPanel.track('LINK_EXTENSION')
        //   },
        // },
      ],
    },
    {
      name: 'Community',
      subMenu: [
        {
          name: 'Discord',
          onClick: () =>
            window.open('https://discord.com/invite/zaXZXGE4Ke', '_blank'),
        },
        {
          name: 'Twitter',
          onClick: () =>
            window.open('https://twitter.com/ideamarket_io', '_blank'),
        },
        // {
        //   name: 'Reddit',
        //   onClick: () =>
        //     window.open('https://www.reddit.com/r/ideamarket/', '_blank'),
        // },
        {
          name: `We're hiring`,
          onClick: () => window.open('https://jobs.ideamarket.io', '_blank'),
        },
        {
          name: 'Swag Shop',
          onClick: () => {
            window.open('https://ideamarket-io.myshopify.com', '_blank')
            mixPanel.track('LINK_SHOW')
          },
        },
      ],
    },
    {
      name: '$IMO',
      subMenu: [
        {
          name: 'Token Address',
          onClick: () => {
            window.open(
              'https://arbiscan.io/address/0xB41bd4C99dA73510d9e081C5FADBE7A27Ac1F814',
              '_blank'
            )
            mixPanel.track('GO_TO_TOKEN_ON_BLOCK_EXPLORER')
          },
        },
        {
          name: 'Stake',
          onClick: () => router.push('/stake'),
        },
        {
          name: 'Early User Airdrop Claim',
          onClick: () => router.push(`/claim/${AIRDROP_TYPES.USER}`),
        },
        {
          name: 'Community Airdrop Claim',
          onClick: () => router.push(`/claim/${AIRDROP_TYPES.COMMUNITY}`),
        },
        {
          name: 'Twitter Verification Airdrop Claim',
          onClick: () =>
            router.push(`/claim/${AIRDROP_TYPES.TWITTER_VERIFICATION}`),
        },
      ],
    },
  ],
})
