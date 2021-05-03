import Layout from "../components/Layout";
import { useState } from "react";

import { DateStatus, UserCalendar } from "../components/UserCalendar";

const CalendarPage = (): JSX.Element => {
  const [dateStatusList, setDateStatusList] = useState<DateStatus[]>([]);
  return (
    <Layout title="Calendar example">
      <h1>Calendar</h1>
      <p>Calendar example</p>
      <UserCalendar
        dateStatusList={dateStatusList}
        setDateStatusList={(list: DateStatus[]) => setDateStatusList(list)}
      />
    </Layout>
  );
};

export default CalendarPage;
