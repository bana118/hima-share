import React, { useRef, useState } from "react";
import { Overlay, Tooltip } from "react-bootstrap";
import Calendar from "react-calendar";
import { UserDateStatusList } from "../interfaces/DateStatus";

type GroupCalendarProps = {
  groupDateStatusList: UserDateStatusList[];
};

type DateToNum = {
  date: Date;
  num: number;
};

export const GroupCalendar = ({
  groupDateStatusList: groupDateStatusList,
}: GroupCalendarProps): JSX.Element => {
  const calendarRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [focusedDate, setFocusedDate] = useState<Date | undefined>(undefined);
  // TODO "dd日" ではなく "dd" だけ表示する
  const dateToFreeNumList: DateToNum[] = [];
  for (const userDateStatusList of groupDateStatusList) {
    const dateTimeList = Object.keys(userDateStatusList.dateStatusList);
    for (const dateTime of dateTimeList) {
      const status = userDateStatusList.dateStatusList[Number(dateTime)];
      if (status == "calendar-free") {
        const index = dateToFreeNumList.findIndex(
          (e) => e.date.getTime() == Number(dateTime)
        );
        if (index == -1) {
          dateToFreeNumList.push({ date: new Date(Number(dateTime)), num: 1 });
        } else {
          dateToFreeNumList[index].num += 1;
        }
      }
    }
  }
  const countFreeNum = (date: Date): number => {
    const dateToFreeNum = dateToFreeNumList.find(
      (e) => e.date.getTime() == date.getTime()
    );
    if (dateToFreeNum == null) {
      return 0;
    } else {
      return dateToFreeNum.num;
    }
  };
  return (
    <React.Fragment>
      <div></div>
      <Calendar
        inputRef={calendarRef}
        onClickDay={(date) => {
          setFocusedDate(date);
          setShowTooltip(true);
        }}
        locale="ja-JP"
        minDate={new Date()}
        minDetail="month"
        maxDetail="month"
        defaultView="month"
        showNavigation={true}
        prev2Label={null}
        next2Label={null}
        tileContent={({ date }) => {
          const freeNum = countFreeNum(date);
          return <div>{freeNum}</div>;
        }}
        tileClassName={({ date }) => {
          const freeNum = countFreeNum(date);
          // TODO 暇な人の人数でスタイルを変えるための基準人数を設定可能にする
          // TODO 色はグラデーションでもいいかもしれない
          if (freeNum >= 5) {
            return "calendar-free";
          } else if (freeNum >= 2) {
            return "calendar-light-free";
          } else {
            return null;
          }
        }}
      />
      <Overlay
        target={calendarRef.current}
        show={showTooltip}
        placement="right"
      >
        {(props) => (
          <Tooltip
            onClick={() => {
              setShowTooltip(false);
            }}
            id="overlay-example"
            {...props}
          >
            {focusedDate?.toString()}
          </Tooltip>
        )}
      </Overlay>
    </React.Fragment>
  );
};
