import Layout from "../components/Layout";
import { useState } from "react";
import { GroupCalendar } from "../components/GroupCalendar";
import { Status, DateStatus } from "../interfaces/DateStatus";

const CalendarPage = (): JSX.Element => {
  const now = new Date();

  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const date1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
  console.log(nowDate);
  const dateStatus1: DateStatus = { date: nowDate, status: "calendar-free" };
  const dateStatus2: DateStatus = { date: date1, status: "calendar-free" };
  const groupDateStatusList = [
    {
      user: "hoge",
      dateStatusList: [dateStatus1, dateStatus2],
    },
    {
      user: "fuga",
      dateStatusList: [dateStatus1],
    },
  ];
  return (
    <Layout title="Calendar example">
      <h1>Calendar</h1>
      <p>Calendar example</p>
      <GroupCalendar groupDateStatusList={groupDateStatusList} />
    </Layout>
  );
};

export default CalendarPage;
