import { db } from "../utils/firebase";
import { UserWithId } from "./User";
import firebase from "firebase/app";

export type Status = "calendar-free" | "calendar-busy";

export type WeekDay = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

type DateTimeOrWeekDay = number | WeekDay;

export const dateTimeToWeekDay = (dateTime: number): WeekDay => {
  const date = new Date(dateTime);
  const weekDayArray: WeekDay[] = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
  ];
  return weekDayArray[date.getDay()];
};

// dateTime => Date: new Date(dateTime), Date => dateTime: Date.getTime()
export type DateStatusList = {
  [dateTimeOrWeekDay in DateTimeOrWeekDay]?: Status | undefined;
};

export type UserDateStatusList = {
  user: UserWithId;
  dateStatusList: DateStatusList;
};

export type UsersStatus = {
  [uid: string]: Status | undefined;
};

export type StatusInfo = {
  free: number;
  busy: number;
  usersStatus: UsersStatus;
};

export const storeDateStatusList = async (
  dateStatusList: DateStatusList,
  uid: string
): Promise<void> => {
  const dateList = Object.keys(dateStatusList);
  const now = new Date();
  const yesterdayNumber = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  ).getTime();
  for (const date of dateList) {
    const dateNumber = Number(date);
    if (dateNumber <= yesterdayNumber) {
      delete dateStatusList[dateNumber];
    }
  }
  return db.ref(`calendars/${uid}`).set(dateStatusList);
};

export const loadDateStatusList = async (
  uid: string
): Promise<DateStatusList> => {
  const snapShot = await db.ref().child("calendars").child(uid).once("value");
  if (snapShot.exists()) {
    const dateStatusList = snapShot.val() as DateStatusList;
    return dateStatusList;
  } else {
    return {};
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
