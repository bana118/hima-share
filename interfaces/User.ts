import { db } from "../utils/firebase";

export interface User {
  name: string;
  email: string;
  groups: {
    [groupId: string]: true;
  };
}

// TODO 必要になればUserWithIdを作る

export const storeUser = (user: User, uid: string): Promise<void> => {
  return db.ref(`users/${uid}`).set(user);
};

export const loadUser = async (uid: string): Promise<User | null> => {
  const snapShot = await db.ref().child("users").child(uid).get();
  if (snapShot.exists()) {
    const u = snapShot.val();
    if (u.groups == null) {
      u["groups"] = {};
    }
    return u as User;
  } else {
    return null;
  }
};

export const joinGroup = (uid: string, groupId: string): Promise<void> => {
  return db.ref(`users/${uid}/groups`).set({ [groupId]: true });
};
