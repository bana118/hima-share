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
      </Head>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
};

export default MyApp;
