import { db } from "../utils/firebase";

export interface User {
  name: string;
  email: string;
  groups?: {
    [groupId: string]: true;
  };
}

export interface UserWithId extends User {
  id: string;
}

export const storeUser = (user: User, uid: string): Promise<void> => {
  return db.ref(`users/${uid}`).set(user);
};

export const loadUser = async (uid: string): Promise<UserWithId | null> => {
  const snapShot = await db.ref().child("users").child(uid).get();
  if (snapShot.exists()) {
    const user = snapShot.val() as User;
    return { ...user, id: uid };
  } else {
    return null;
  }
};

export const joinGroup = async (
  uid: string,
  groupId: string
): Promise<void> => {
  await db.ref(`users/${uid}/groups`).update({ [groupId]: true });
  return await db.ref(`groups/${groupId}/members`).update({ [uid]: true });
};
