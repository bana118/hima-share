import moment from "moment";

type Status = "free" | "busy" | "undecided";

type dateStatus = {
  date: moment.Moment;
  status: Status;
};

type StatusCalenderProps = {
  dateStatusList: dateStatus[];
  setDateStatusList: (list: dateStatus[]) => void;
};

export const StatusCalender = ({
  dateStatusList,
  setDateStatusList,
}: StatusCalenderProps): JSX.Element => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        <ListItem data={item} />
      </li>
    ))}
  </ul>
);
