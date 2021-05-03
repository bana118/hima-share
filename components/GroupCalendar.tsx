import Calendar from "react-calendar";
import { Status, DateStatus } from "../interfaces/DateStatus";
import firebase from "firebase/app";

type UserDateStatusList = {
  user: firebase.User;
  dateSatusList: DateStatus[];
};

type GroupCalendarProps = {
  groupDateStatusList: UserDateStatusList[];
};

export const GroupCalendar = ({
  groupDateStatusList: groupDateStatusList,
}: GroupCalendarProps): JSX.Element => {
  // TODO "dd日" ではなく "dd" だけ表示する

  const countFreeNum = (date: Date): number => {
    return 2;
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
      //   tileClassName={({ date }): Status | null => {
      //     const dateInList = groupDateStatus.find(
      //       (d) => d.date.getTime() == date.getTime()
      //     );
      //     if (dateInList == null) {
      //       return null;
      //     } else {
      //       return dateInList.status;
      //     }
      //   }}
    />
  );
};
