import Head from "next/head";

interface MyHeadProps {
  title?: string;
}

export const MyHead = ({
  title = "Default Title",
}: MyHeadProps): JSX.Element => {
  const url = document.location.href;
  const twiiterId = process.env.NEXT_PUBLIC_TWITTER_ID;
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link rel="canonical" href={url} />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Roboto&display=swap"
        rel="stylesheet"
      />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ja_JP" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content="あなたの暇な日をシェアしよう" />
      <meta property="og:image" content="/about1.png" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={twiiterId} />
    </Head>
  );
};
