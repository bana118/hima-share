import moment from "moment";
import { DayPicker } from "react-dates";

type Status = "free" | "busy" | "undecided";

export type DateStatus = {
  date: moment.Moment;
  status: Status;
};

type StatusCalenderProps = {
  dateStatusList: DateStatus[];
  setDateStatusList: (list: DateStatus[]) => void;
};

export const StatusCalender = ({
  dateStatusList,
  setDateStatusList,
}: StatusCalenderProps): JSX.Element => {
  const updateDateStatusList = (day: moment.Moment) => {
    console.log(dateStatusList);
    const index = dateStatusList.findIndex((ds) => ds.date === day);
    if (index == -1) {
      const newDateStatus: DateStatus = { date: day, status: "busy" };
      setDateStatusList([...dateStatusList, newDateStatus]);
    }
  };
  return (
    <DayPicker
      numberOfMonths={1}
      onDayClick={updateDateStatusList}
      renderDayContents={(day) => {
        const dateStatus = dateStatusList.find((ds) => ds.date === day);
        const isBusy = dateStatus != null && dateStatus.status == "busy";
        return isBusy ? "B" : day.format("D");
      }}
    />
  );
};
