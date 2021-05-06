import { db } from "../utils/firebase";
import { UserWithId } from "./User";

export type Status = "calendar-free" | "calendar-busy";

// dateTime => Date: new Date(dateTime), Date => dateTime: Date.getTime()
export interface DateStatusList {
  [dateTime: number]: Status | undefined;
}

export interface UserDateStatusList {
  user: UserWithId;
  dateStatusList: DateStatusList;
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
