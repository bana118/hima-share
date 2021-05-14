import type { AppProps } from "next/app";
import "react-calendar/dist/Calendar.css";
import { useEffect } from "react";
import { useState } from "react";
import firebase from "firebase/app";
import { auth } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import "../styles/sass/bootstrap-custom.scss";
import "../styles/sass/calendar.scss";
import "../styles/sass/navbar.scss";
import "../styles/sass/about.scss";
import { analytics } from "../utils/firebase";

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
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
};

export default MyApp;
