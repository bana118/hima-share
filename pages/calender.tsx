import Layout from "../components/Layout";
import { useState } from "react";

import { DateStatus, UserCalender } from "../components/UserCalendar";

const CalenderPage = (): JSX.Element => {
  const [dateStatusList, setDateStatusList] = useState<DateStatus[]>([]);
  return (
    <Layout title="Calender example">
      <h1>Calender</h1>
      <p>Calender example</p>
      <UserCalender
        dateStatusList={dateStatusList}
        setDateStatusList={(list: DateStatus[]) => setDateStatusList(list)}
      />
    </Layout>
  );
};

export default CalenderPage;
