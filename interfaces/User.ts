import { db } from "../utils/firebase";

export type User = {
  name: string;
  email: string;
};

export const setUser = (user: User, uid: string): Promise<undefined> => {
  return db.ref(`users/${uid}`).set(user);
};
