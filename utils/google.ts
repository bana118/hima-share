import "firebase/auth";
import firebase from "firebase/app";
import { auth } from "./firebase";

export const loginWithGoogle = async (): Promise<void> => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithRedirect(provider);
  } catch (error) {
    console.error(error);
  }
};

export const getLoginResult = async () => {
  const result = await auth.getRedirectResult();
  if (result.credential) {
    console.log(result);
    const credential = result.credential;
    const authUser = result.user;
  }
};
