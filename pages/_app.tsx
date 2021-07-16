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
import { storeUserfromLoginResult } from "utils/auth-provider";
import { DefaultSeo } from "next-seo";
import { defaultSeoConfig } from "../next-seo.config";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const [authUser, setAuthUser] = useState<firebase.User | null | undefined>(
    undefined
  );

  useEffect(() => {
    const getLoginResult = async () => {
      await storeUserfromLoginResult();
    };
    auth.onAuthStateChanged(async (u) => {
      setAuthUser(u);
      if (u != null) {
        await getLoginResult();
      }
    });

    if (process.env.NODE_ENV === "production") {
      analytics();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authUser }}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-navbutton-color" content="#ff0033" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#ff0033" />
        <meta name="application-name" content="Hima Share" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hima Share" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ff0033" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <DefaultSeo {...defaultSeoConfig} />
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
};

export default MyApp;
