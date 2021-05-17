import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import firebase from "firebase/app";
import { auth, analytics } from "../utils/firebase";
import "../styles/sass/bootstrap-custom.scss";
import "../styles/sass/calendar.scss";
import "../styles/sass/navbar.scss";
import "../styles/sass/about.scss";
import "react-calendar/dist/Calendar.css";
import Head from "next/head";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const [authUser, setAuthUser] = useState<firebase.User | null | undefined>(
    undefined
  );
  const url = typeof window !== "undefined" ? document.location.href : "";
  const origin = typeof window !== "undefined" ? document.location.origin : "";
  const twiiterId = process.env.NEXT_PUBLIC_TWITTER_ID;

  useEffect(() => {
    auth.onAuthStateChanged((u) => {
      setAuthUser(u);
    });

    if (process.env.NODE_ENV === "production") {
      console.log(process.env.NODE_ENV);
      analytics();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authUser }}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:title" content="Hima Share" />
        <meta
          property="og:description"
          content="あなたの暇な日をシェアしよう"
        />
        <meta property="og:image" content={`${origin}/about1.png`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={twiiterId} />
      </Head>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
};

export default MyApp;
