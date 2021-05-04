import { db } from "../utils/firebase";

export type Status = "calendar-free" | "calendar-busy";

export interface DateStatus {
  date: Date;
  status: Status;
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

export const setDateStatusList = async (
  dateStatusList: DateStatus[],
  uid: string,
  onSet?: (dataStatusList: DateStatus[]) => void,
  onError?: () => void
): Promise<void> => {
  const data = toFormatData(dateStatusList);
  return db
    .ref(`calendars/${uid}`)
    .set(data)
    .then(() => {
      if (onSet != null) {
        onSet;
      }
    })
    .catch(() => {
      if (onError != null) {
        onError();
      }
      return Promise.reject<void>("Database Error!");
    });
};

export const getDateStatusList = async (
  uid: string,
  onError?: () => void
): Promise<DateStatus[] | null> => {
  const data = db
    .ref()
    .child("calendar")
    .child(uid)
    .get()
    .then((snapShot) => {
      if (snapShot.exists()) {
        const formatData = snapShot.val() as formatDataType;
        const dateStatusList = fromFormatData(formatData);
        return dateStatusList;
      } else {
        return null;
      }
    })
    .catch(() => {
      if (onError != null) {
        onError;
      }
      return Promise.reject<null>("Database Error!");
    });
  return data;
};
