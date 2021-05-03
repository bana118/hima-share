import { useState } from "react";
import Layout from "../components/Layout";
import { UserCalendar } from "../components/UserCalendar";
import { DateStatus } from "../interfaces/DateStatus";

const UserCalendarPage = (): JSX.Element => {
  const [dateStatusList, setDateStatusList] = useState<DateStatus[]>([]);
  return (
    <Layout title="カレンダー入力">
      <h1>カレンダー入力</h1>
      <p>カレンダーに予定を設定してください</p>
      <UserCalendar
        dateStatusList={dateStatusList}
        setDateStatusList={(list) => setDateStatusList(list)}
      />
    </Layout>
  );
};

export default UserCalendarPage;
