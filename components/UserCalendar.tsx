import Calendar from "react-calendar";
import { Status, DateStatus } from "../interfaces/DateStatus";

type UserCalendarProps = {
  dateStatusList: DateStatus[];
  setDateStatusList: (list: DateStatus[]) => void;
};

export const UserCalendar = ({
  dateStatusList,
  setDateStatusList,
}: UserCalendarProps): JSX.Element => {
  const updateDateStatusList = async (date: Date) => {
    const index = dateStatusList.findIndex(
      (ds) => ds.date.getTime() == date.getTime()
    );

    if (index == -1) {
      const newDateStatus: DateStatus = { date: date, status: "calendar-free" };
      setDateStatusList([...dateStatusList, newDateStatus]);
    } else if (dateStatusList[index].status == "calendar-free") {
      dateStatusList[index].status = "calendar-busy";
      setDateStatusList([...dateStatusList]);
    } else {
      dateStatusList.splice(index, 1);
      setDateStatusList([...dateStatusList]);
    }
  };

  // TODO "dd日" ではなく "dd" だけ表示する
  // TODO 過ぎた日の扱いを決める (e.g. 毎日自動で消す, そのまま残す)
  return (
    <Calendar
      onClickDay={updateDateStatusList}
      locale="ja-JP"
      minDate={new Date()}
      minDetail="month"
      maxDetail="month"
      defaultView="month"
      showNavigation={true}
      prev2Label={null}
      next2Label={null}
      tileClassName={({ date }): Status | null => {
        const dateInList = dateStatusList.find(
          (d) => d.date.getTime() == date.getTime()
        );
        if (dateInList == null) {
          return null;
        } else {
          return dateInList.status;
        }
      }}
    />
  );
};
