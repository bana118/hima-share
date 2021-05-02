import Layout from "../components/Layout";
import { useState } from "react";

import { DateStatus, StatusCalender } from "../components/StatusCalendar";

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
