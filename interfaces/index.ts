// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';
import firebase from "firebase/app";

export type User = {
  id: string;
  name: string;
};

export const userConverter = {
  toFirestore(user: User): firebase.firestore.DocumentData {
    return { name: user.name };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): User {
    const data = snapshot.data(options);
    return { id: snapshot.id, name: data.name };
  },
};
