import { NextSeoProps } from "next-seo";

const url = typeof window !== "undefined" ? document.location.href : "";
const origin = process.env.NEXT_PUBLIC_APP_URL;
const twiiterId = process.env.NEXT_PUBLIC_TWITTER_ID;

export const defaultSeoConfig: NextSeoProps = {
  defaultTitle: "Hima Share",
  titleTemplate: "%s | Hima Share",
  description:
    "あなたの暇な日をシェアしよう。簡単操作で暇な日、忙しい日をグループ内で共有することができます。",
  canonical: url,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: url,
    title: "Hima Share",
    description: "あなたの暇な日をシェアしよう",
    images: [{ url: `${origin}/about1.png` }],
  },
  twitter: {
    handle: twiiterId,
    site: twiiterId,
    cardType: "summary",
  },
};
