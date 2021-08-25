import Document, { Html, Head, Main, NextScript } from "next/document";

export default class document extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>
        <body onTouchStart={null}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
