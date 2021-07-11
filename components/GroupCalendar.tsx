import { GroupWithId } from "interfaces/Group";
import React, { useState } from "react";
import Calendar from "react-calendar";
import {
  dateTimeToWeekDay,
  UserDateStatusList,
} from "../interfaces/DateStatus";
import { UserInfoOfDay } from "./UserInfoOfDay";

interface GroupCalendarProps {
  groupDateStatusList: UserDateStatusList[];
  group: GroupWithId;
}

export const GroupCalendar = ({
  groupDateStatusList,
  group,
}: GroupCalendarProps): JSX.Element => {
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  const countFreeNum = (date: Date): number => {
    const dateTime = date.getTime();
    const weekDay = dateTimeToWeekDay(dateTime);
    let count = 0;
    for (const userDateStatusList of groupDateStatusList) {
      const dateStatusList = userDateStatusList.dateStatusList;
      if (
        dateStatusList[dateTime] == "calendar-free" ||
        (dateStatusList[dateTime] == null &&
          dateStatusList[weekDay] == "calendar-free")
      ) {
        count += 1;
      }
    }
    return count;
  };

  const invitationId = group.invitationId;

  return (
    <React.Fragment>
      <UserInfoOfDay
        date={focusedDate}
        groupId={group.id}
        invitationId={invitationId}
        groupDateStatusList={groupDateStatusList}
        close={() => {
          setShowUserInfo(false);
          setFocusedDate(null);
        }}
      />
      <Calendar
        className={showUserInfo ? "calendar-hidden" : ""}
        onClickDay={(date) => {
          setFocusedDate(date);
          setShowUserInfo(true);
        }}
        locale="ja-JP"
        minDate={new Date()}
        minDetail="month"
        maxDetail="month"
        defaultView="month"
        formatDay={(_locale, date) => {
          const day = date.getDate();
          return `${day}`;
        }}
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
          // TODO 色は無段階でもいいかもしれない
          if (freeNum >= 5) {
            return "calendar-free";
          } else if (freeNum >= 2) {
            return "calendar-light-free";
          } else {
            return null;
          }
        }}
      />
    </React.Fragment>
  );
};
