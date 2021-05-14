import Head from "next/head";

interface MyHeadProps {
  title?: string;
}

export const MyHead = ({
  title = "Default Title",
}: MyHeadProps): JSX.Element => {
  const url = typeof window !== "undefined" ? document.location.href : "";
  const twiiterId = process.env.NEXT_PUBLIC_TWITTER_ID;
  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={url} />
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
