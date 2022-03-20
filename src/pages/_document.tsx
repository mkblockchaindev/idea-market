import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  static GA_TRACKING_ID =
    process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ||
    process.env.NEXT_PUBLIC_NETWORK === 'avm'
      ? 'UA-185970351-3'
      : 'UA-185970351-2'

  static pageview = (url) => {
    ;(window as any).gtag('config', MyDocument.GA_TRACKING_ID, {
      page_path: url,
    })
  }

  static event = ({ action, category, label, value }) => {
    ;(window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charSet="utf-8"
          />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${MyDocument.GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${MyDocument.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />

          {/* Hotjar Tracking Code for app.ideamarket.io */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:2487731,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
            }}
          />

          <link rel="manifest" href="/manifest.json" />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/icons/icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="256x256"
            href="/icons/icon-256x256.png"
          />
          <link
            rel="apple-touch-icon"
            type="image/png"
            sizes="192x192"
            href="/icons/icon-192x192-iphone.png"
          />
          <link
            rel="apple-touch-icon"
            type="image/png"
            sizes="256x256"
            href="/icons/icon-256x256-iphone.png"
          />
          <meta name="theme-color" content="#317EFB" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
