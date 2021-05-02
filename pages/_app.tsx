import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useState } from "react";
import firebase from "firebase/app";
import { auth } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import "../styles/sass/custom.scss";
import moment from "moment";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const [user, setUser] = useState<firebase.User | null>(null);
  useEffect(() => {
    auth.onAuthStateChanged((u) => {
      setUser(u);
    });
  }, []);

  // Set global localization for calender
  moment.locale("ja");

  return (
    <AuthContext.Provider value={{ user }}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
};

export default MyApp;
