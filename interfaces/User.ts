import { db } from "../utils/firebase";

export interface User {
  name: string;
  email: string;
  groups?: {
    // Chat Id (eg. Slack, Discor, Twitter...)
    [groupId: string]: string;
  };
  description: string;
}

export interface UserWithId extends User {
  id: string;
}

export const storeUser = (user: User, uid: string): Promise<void> => {
  return db.ref(`users/${uid}`).set(user);
};

export const loadUser = async (uid: string): Promise<UserWithId | null> => {
  const snapShot = await db.ref().child("users").child(uid).once("value");
  if (snapShot.exists()) {
    const user = snapShot.val() as User;
    return { ...user, id: uid };
  } else {
    return null;
  }
};

export const joinGroup = async (
  uid: string,
  groupId: string,
  chatId: string
): Promise<void> => {
  const updates = {
    [`/users/${uid}/groups/${groupId}`]: chatId,
    [`/groups/${groupId}/members/${uid}`]: chatId,
  };
  return await db.ref().update(updates);
};

export const updateUser = async (user: User, uid: string): Promise<void> => {
  const newUser: User = {
    name: user.name,
    email: user.email,
    groups: user.groups,
    description: user.description,
  };
  const updates = {
    [`/users/${uid}`]: newUser,
  };
  return await db.ref().update(updates);
};
