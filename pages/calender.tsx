import Layout from "../components/Layout";
import { useState } from "react";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateStatus } from "../components/StatusCalender";
import { StatusCalender } from "../components/StatusCalender";

const CalenderPage = (): JSX.Element => {
  const [dateStatusList, setDateStatusList] = useState<DateStatus[]>([]);
  return (
    <Layout title="Calender example">
      <h1>Calender</h1>
      <p>Calender example</p>
      <StatusCalender
        dateStatusList={dateStatusList}
        setDateStatusList={(list: DateStatus[]) => setDateStatusList(list)}
      />
    </Layout>
  );
};

export default CalenderPage;
