import Calendar from "react-calendar";
import {
  Status,
  DateStatusList,
  dateTimeToWeekDay,
} from "../interfaces/DateStatus";

type UserCalendarProps = {
  dateStatusList: DateStatusList;
  setDateStatusList: (list: DateStatusList) => void;
};

export const UserCalendar = ({
  dateStatusList,
  setDateStatusList,
}: UserCalendarProps): JSX.Element => {
  const updateDateStatusList = async (date: Date) => {
    const dateTime = date.getTime();
    const status = dateStatusList[dateTime];

    if (status == null) {
      dateStatusList[dateTime] = "calendar-free";
      setDateStatusList({ ...dateStatusList });
    } else if (status == "calendar-free") {
      dateStatusList[dateTime] = "calendar-busy";
      setDateStatusList({ ...dateStatusList });
    } else {
      delete dateStatusList[dateTime];
      setDateStatusList({ ...dateStatusList });
    }
  };

  // TODO 過ぎた日の扱いを決める (e.g. 毎日自動で消す, そのまま残す)
  return (
    <Calendar
      onClickDay={updateDateStatusList}
      locale="ja-JP"
      minDate={new Date()}
      minDetail="month"
      maxDetail="month"
      defaultView="month"
      formatDay={(_locale, date) => {
        const day = date.getDate();
        return `${day}`;
      }}
      showNavigation={true}
      prev2Label={null}
      next2Label={null}
      tileClassName={({ date }): Status | null => {
        const dateTime = date.getTime();
        const status = dateStatusList[dateTime];
        if (status != null) return status;
        const weekDay = dateTimeToWeekDay(dateTime);
        const weekDayStatus = dateStatusList[weekDay];
        if (weekDayStatus != null) return weekDayStatus;
        return null;
      }}
    />
  );
};
