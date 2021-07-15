import { NextSeoProps } from "next-seo";

const url = typeof window !== "undefined" ? document.location.href : "";
const origin = typeof window !== "undefined" ? document.location.origin : "";
const twiiterId = process.env.NEXT_PUBLIC_TWITTER_ID;

export const defaultSeoConfig: NextSeoProps = {
  defaultTitle: "Hima Share",
  titleTemplate: "%s | Hima Share",
  description: "あなたの暇な日をシェアしよう",
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
