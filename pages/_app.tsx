import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-calendar/dist/Calendar.css";
import { useEffect } from "react";
import { useState } from "react";
import firebase from "firebase/app";
import { auth } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import "../styles/sass/custom.scss";
import "../styles/sass/calender.scss";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const [user, setUser] = useState<firebase.User | null>(null);
  useEffect(() => {
    auth.onAuthStateChanged((u) => {
      setUser(u);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
};

export default MyApp;
