import { db } from "../utils/firebase";

export interface User {
  name: string;
  email: string;
}

export const setUser = async (
  user: User,
  uid: string,
  onSet?: (u: User) => void,
  onError?: () => void
): Promise<void> => {
  return db
    .ref(`users/${uid}`)
    .set(user)
    .then(() => {
      if (onSet != null) {
        onSet;
      }
    })
    .catch(() => {
      if (onError != null) {
        onError();
      }
    });
};

export const getUser = (
  uid: string,
  onError?: () => void
): Promise<User | null> => {
  const user = db
    .ref()
    .child("users")
    .child(uid)
    .get()
    .then((snapShot) => {
      if (snapShot.exists()) {
        return snapShot.val() as User;
      } else {
        return null;
      }
    })
    .catch(() => {
      if (onError != null) {
        onError;
      }
      return null;
    });
  return user;
};
