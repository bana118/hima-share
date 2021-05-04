import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-calendar/dist/Calendar.css";
import { useEffect } from "react";
import { useState } from "react";
import firebase from "firebase/app";
import { auth } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import "../styles/sass/bootstrap-custom.scss";
import "../styles/sass/calendar.scss";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    auth.onAuthStateChanged((u) => {
      setUser(u);
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ authUser: user, isLoading }}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
};

export default MyApp;
