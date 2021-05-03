import Layout from "../components/Layout";
import { useState } from "react";
import { GroupCalendar } from "../components/GroupCalendar";

const CalendarPage = (): JSX.Element => {
  return (
    <Layout title="Calendar example">
      <h1>Calendar</h1>
      <p>Calendar example</p>
      <GroupCalendar groupDateStatusList={[]} />
    </Layout>
  );
};

export default CalendarPage;
