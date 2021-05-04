import { db } from "../utils/firebase";

export interface User {
  name: string;
  email: string;
}

export const storeUser = async (user: User, uid: string): Promise<void> => {
  return db
    .ref(`users/${uid}`)
    .set(user)
    .catch(() => {
      return Promise.reject<void>("Database Error!");
    });
};

export const loadUser = (uid: string): Promise<User | null> => {
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
      return Promise.reject<null>("Database Error!");
    });
  return user;
};
