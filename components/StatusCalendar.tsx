import Calendar from "react-calendar";

type Status = "calender-free" | "calender-busy";

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
  const updateDateStatusList = (date: Date) => {
    const index = dateStatusList.findIndex(
      (ds) => ds.date.getTime() == date.getTime()
    );
    if (index == -1) {
      const newDateStatus: DateStatus = { date: date, status: "calender-free" };
      setDateStatusList([...dateStatusList, newDateStatus]);
    } else if (dateStatusList[index].status == "calender-free") {
      dateStatusList[index].status = "calender-busy";
      setDateStatusList([...dateStatusList]);
    } else {
      dateStatusList.splice(index, 1);
      setDateStatusList([...dateStatusList]);
    }
  };

  return (
    <Calendar
      onClickDay={updateDateStatusList}
      locale="ja-JP"
      minDetail="month"
      maxDetail="month"
      defaultView="month"
      showNavigation={true}
      prev2Label={null}
      next2Label={null}
      tileClassName={({ date }) => {
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
