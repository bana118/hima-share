import { db } from "../utils/firebase";
import { UserWithId } from "./User";
import firebase from "firebase/app";

export type Status = "calendar-free" | "calendar-busy";

// dateTime => Date: new Date(dateTime), Date => dateTime: Date.getTime()
export interface DateStatusList {
  [dateTime: number]: Status | undefined;
}

export interface UserDateStatusList {
  user: UserWithId;
  dateStatusList: DateStatusList;
}

export interface UsersStatus {
  [uid: string]: Status | undefined;
}

export interface StatusInfo {
  free: number;
  busy: number;
  usersStatus: UsersStatus;
}
export interface DateTimeToStatusInfoList {
  [dateTime: number]: StatusInfo | undefined;
}

export const storeDateStatusList = async (
  dateStatusList: DateStatusList,
  uid: string
): Promise<void> => {
  return db.ref(`calendars/${uid}`).set(dateStatusList);
};

export const loadDateStatusList = async (
  uid: string
): Promise<DateStatusList> => {
  const snapShot = await db.ref().child("calendars").child(uid).once("value");
  if (snapShot.exists()) {
    return snapShot.val() as DateStatusList;
  } else {
    return [];
  }
};

export const watchDateStatusList = (
  uid: string,
  eventType: firebase.database.EventType,
  onValueChanged: (
    key: string | null,
    value?: DateStatusList | null,
    childValue?: Status | null
  ) => void
): void => {
  const ref = db.ref(`calendars/${uid}`);
  ref.on(eventType, (snapShot) => {
    if (eventType == "value") {
      const key = snapShot.key;
      const data = snapShot.val() as DateStatusList | null;
      onValueChanged(key, data, undefined);
    } else {
      const key = snapShot.key;
      const childData = snapShot.val() as Status | null;
      onValueChanged(key, undefined, childData);
    }
  });
};

export const unWatchDataStatusList = (uid: string): void => {
  const ref = db.ref(`calendars/${uid}`);
  ref.off();
};
