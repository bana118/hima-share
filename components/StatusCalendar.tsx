import Calendar from "react-calendar";
import { useState } from "react";

type Status = "free" | "busy" | "undecided";

export type DateStatus = {
  date: Date;
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
  const updateDateStatusList = (day: Date) => {
    console.log(dateStatusList);
    const index = dateStatusList.findIndex(
      (ds) => ds.date.getTime() == day.getTime()
    );
    if (index == -1) {
      const newDateStatus: DateStatus = { date: day, status: "busy" };
      setDateStatusList([...dateStatusList, newDateStatus]);
    }
  };
  const dateList = dateStatusList.map((dateStatus) => dateStatus.date);

  return (
    <Calendar
      value={dateList.length == 0 ? null : dateList}
      onClickDay={(d) => {
        updateDateStatusList(d);
      }}
      locale="ja-JP"
      calendarType="US"
    />
  );
};
