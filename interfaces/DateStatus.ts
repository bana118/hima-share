import { db } from "../utils/firebase";
import { User } from "./User";

export type Status = "calendar-free" | "calendar-busy";

export interface DateStatus {
  date: Date;
  status: Status;
}

export interface UserDateStatusList {
  user: User;
  dateStatusList: DateStatus[];
}

interface formatDataType {
  [key: number]: Status;
}

const toFormatData = (dateStatusList: DateStatus[]) => {
  const formatData: formatDataType = {};
  for (const dateStatus of dateStatusList) {
    const time = dateStatus.date.getTime();
    formatData[time] = dateStatus.status;
  }
  return formatData;
};

const fromFormatData = (formatData: formatDataType) => {
  const dataStatusList: DateStatus[] = [];
  for (const key in formatData) {
    const date = new Date(Number(key));
    const status = formatData[key];
    dataStatusList.push({ date: date, status: status });
  }
  return dataStatusList;
};

export const storeDateStatusList = async (
  dateStatusList: DateStatus[],
  uid: string
): Promise<void> => {
  const data = toFormatData(dateStatusList);
  return db.ref(`calendars/${uid}`).set(data);
};

export const loadDateStatusList = async (
  uid: string
): Promise<DateStatus[] | null> => {
  const snapShot = await db.ref().child("calendars").child(uid).get();
  if (snapShot.exists()) {
    const formatData = snapShot.val() as formatDataType;
    const dateStatusList = fromFormatData(formatData);
    return dateStatusList;
  } else {
    return null;
  }
};
