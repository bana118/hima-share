import Layout from "../components/Layout";
import { useState } from "react";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import { SingleDatePicker } from "react-dates";

const RegisterPage = (): JSX.Element => {
  const [date, setDate] = useState<moment.Moment | null>(moment);
  const [focused, setFocused] = useState<boolean>(false);
  return (
    <Layout title="Calender example">
      <h1>Calender</h1>
      <p>Calender example</p>
      <div>
        <SingleDatePicker
          date={date}
          onDateChange={(d) => setDate(d)}
          focused={focused}
          onFocusChange={(f) => setFocused(f.focused)}
          id="date"
        />
      </div>
    </Layout>
  );
};

export default RegisterPage;
