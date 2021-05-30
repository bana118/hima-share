import "firebase/auth";
import firebase from "firebase/app";
import { auth } from "./firebase";
import { storeUser, User } from "interfaces/User";

export const getProviderUserData = (
  u: firebase.User,
  providerId: "password" | "google.com"
): firebase.UserInfo | null => {
  const userInfoList = u.providerData;
  const providerUserData = userInfoList.find(
    (userInfo) => userInfo != null && userInfo.providerId === providerId
  );
  if (providerUserData == null) return null;
  return providerUserData;
};

export const loginWithGoogle = async (): Promise<void> => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithRedirect(provider);
  } catch {
    console.error("Unexpected Error");
  }
};

export const linkWithGoogle = async (
  authUser: firebase.User
): Promise<void> => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await authUser.linkWithRedirect(provider);
  } catch {
    console.error("Unexpected Error");
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
