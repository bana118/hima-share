import Calendar from "react-calendar";
import { DateStatus } from "../interfaces/DateStatus";
import firebase from "firebase/app";

type UserDateStatusList = {
  user: firebase.User;
  dateStatusList: DateStatus[];
};

type GroupCalendarProps = {
  groupDateStatusList: UserDateStatusList[];
};

type DateToNum = {
  date: Date;
  num: number;
};

export const GroupCalendar = ({
  groupDateStatusList: groupDateStatusList,
}: GroupCalendarProps): JSX.Element => {
  // TODO "dd日" ではなく "dd" だけ表示する
  const dateToFreeNumList: DateToNum[] = [];
  for (const userDateStatusList of groupDateStatusList) {
    for (const dateStatus of userDateStatusList.dateStatusList) {
      if (dateStatus.status == "calendar-free") {
        const index = dateToFreeNumList.findIndex(
          (e) => e.date.getTime() == dateStatus.date.getTime()
        );
        if (index == -1) {
          dateToFreeNumList.push({ date: dateStatus.date, num: 1 });
        } else {
          dateToFreeNumList[index].num += 1;
        }
      }
    }
  }
  const countFreeNum = (date: Date): number => {
    const dateToFreeNum = dateToFreeNumList.find(
      (e) => e.date.getTime() == date.getTime()
    );
    if (dateToFreeNum == null) {
      return 0;
    } else {
      return dateToFreeNum.num;
    }
  };
  return (
    <Calendar
      locale="ja-JP"
      minDate={new Date()}
      minDetail="month"
      maxDetail="month"
      defaultView="month"
      showNavigation={true}
      prev2Label={null}
      next2Label={null}
      tileContent={({ date }) => {
        const freeNum = countFreeNum(date);
        return <div>{freeNum}</div>;
      }}
      tileClassName={({ date }) => {
        const freeNum = countFreeNum(date);
        // TODO 暇な人の人数でスタイルを変えるための基準人数を設定可能にする
        // TODO 色はグラデーションでもいいかもしれない
        if (freeNum >= 5) {
          return "calendar-free";
        } else if (freeNum >= 2) {
          return "calendar-light-free";
        } else {
          return null;
        }
      }}
    />
  );
};
