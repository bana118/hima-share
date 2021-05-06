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

// interface formatDataType {
//   [key: number]: Status;
// }

// const toFormatData = (dateStatusList: DateStatus[]) => {
//   const formatData: formatDataType = {};
//   for (const dateStatus of dateStatusList) {
//     const time = dateStatus.date.getTime();
//     formatData[time] = dateStatus.status;
//   }
//   return formatData;
// };

// const fromFormatData = (formatData: formatDataType) => {
//   const dataStatusList: DateStatus[] = [];
//   for (const key in formatData) {
//     const date = new Date(Number(key));
//     const status = formatData[key];
//     dataStatusList.push({ date: date, status: status });
//   }
//   return dataStatusList;
// };

export const storeDateStatusList = async (
  dateStatusList: DateStatusList,
  uid: string
): Promise<void> => {
  return db.ref(`calendars/${uid}`).set(dateStatusList);
};

export const loadDateStatusList = async (
  uid: string
): Promise<DateStatusList> => {
  const snapShot = await db.ref().child("calendars").child(uid).get();
  if (snapShot.exists()) {
    return snapShot.val() as DateStatusList;
  } else {
    return [];
  }
};
