import firebase from "firebase/app";

export type Status = "calendar-free" | "calendar-busy";

export type DateStatus = {
  date: Date;
  status: Status;
};

export const dateStatusListConverter = {
  toFirestore(dateStatusList: DateStatus[]): firebase.firestore.DocumentData {
    return { dateStatusList: dateStatusList };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): DateStatus[] {
    const data = snapshot.data(options);
    return { dateStatusList: data.dateStatusList };
  },
};
