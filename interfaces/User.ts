import { db } from "../utils/firebase";

export interface User {
  name: string;
  email: string;
  groups: {
    [key: string]: true;
  };
}

export const storeUser = (user: User, uid: string): Promise<void> => {
  return db.ref(`users/${uid}`).set(user);
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
    });

  return user;
};

export const joinGroup = (uid: string, groupId: string): Promise<void> => {
  return db.ref(`users/${uid}/groups`).set({ [groupId]: true });
};
