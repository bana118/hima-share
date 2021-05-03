import { db } from "../utils/firebase";
import firebase from "firebase/app";

export type User = {
  name: string;
  email: string;
};

export const setUser = (user: User, uid: string): Promise<undefined> => {
  return db.ref(`users/${uid}`).set(user);
};

export const getUser = (
  uid: string
): Promise<firebase.database.DataSnapshot> => {
  return db.ref(`users/${uid}`).get();
};
