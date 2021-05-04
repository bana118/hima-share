import { createContext } from "react";
import firebase from "firebase/app";

export const AuthContext = createContext<{
  user: firebase.User | null;
  isLoading: boolean;
}>({
  user: null,
  isLoading: true,
});
