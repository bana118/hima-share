import "firebase/auth";
import firebase from "firebase/app";
import { auth } from "./firebase";
import { storeUser, User } from "interfaces/User";

export const loginWithGoogle = async (): Promise<void> => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithRedirect(provider);
  } catch (error) {
    console.error(error);
  }
};

export const storeUserfromLoginResult = async (): Promise<void> => {
  try {
    const result = await auth.getRedirectResult();
    if (
      result.credential &&
      result.user &&
      result.additionalUserInfo?.isNewUser
    ) {
      const authUser = result.user;
      const user: User = {
        name: authUser.displayName == null ? "ユーザー" : authUser.displayName,
        description: "",
      };
      await storeUser(user, authUser.uid);
    }
  } catch (error) {
    console.error(error);
  }
};
