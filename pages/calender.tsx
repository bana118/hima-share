import Layout from "../components/Layout";
import { useState } from "react";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import { DayPicker } from "react-dates";

const CalenderPage = (): JSX.Element => {
  const [date, setDate] = useState<moment.Moment | null>(moment);
  const [focused, setFocused] = useState<boolean>(false);
  return (
    <Layout title="Calender example">
      <h1>Calender</h1>
      <p>Calender example</p>
      <div>
        <DayPicker numberOfMonths={1} />
      </div>
    </Layout>
  );
};

export default CalenderPage;
