import React, { useRef, useState } from "react";
import Calendar from "react-calendar";
import { Status, UserDateStatusList } from "../interfaces/DateStatus";

interface GroupCalendarProps {
  groupDateStatusList: UserDateStatusList[];
}

interface UsersStatus {
  [uid: string]: Status | undefined;
}

interface StatusInfo {
  free: number;
  busy: number;
  usersStatus: UsersStatus;
}
interface DateTimeToStatusInfoList {
  [dateTime: number]: StatusInfo | undefined;
}

export const GroupCalendar = ({
  groupDateStatusList: groupDateStatusList,
}: GroupCalendarProps): JSX.Element => {
  const users = groupDateStatusList.map(
    (groupDateStatus) => groupDateStatus.user
  );
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  // TODO "dd日" ではなく "dd" だけ表示する
  const dateToStatusInfoList: DateTimeToStatusInfoList = {};

  for (const userDateStatusList of groupDateStatusList) {
    const user = userDateStatusList.user;
    const dateTimeList = Object.keys(userDateStatusList.dateStatusList);
    for (const dateTime of dateTimeList) {
      const numberDateTime = Number(dateTime);
      if (dateToStatusInfoList[numberDateTime] == null) {
        dateToStatusInfoList[numberDateTime] = {
          free: 0,
          busy: 0,
          usersStatus: {},
        };
      }
      const status = userDateStatusList.dateStatusList[numberDateTime];
      const statusInfo = dateToStatusInfoList[numberDateTime];
      if (statusInfo != null) {
        if (status == "calendar-free") {
          statusInfo.free += 1;
        } else if (status == "calendar-busy") {
          statusInfo.busy += 1;
        }
        if (status != null) {
          statusInfo.usersStatus[user.id] = status;
        }
      }
    }
  }

  const countFreeNum = (date: Date): number => {
    const dateTime = date.getTime();
    const statusInfo = dateToStatusInfoList[dateTime];
    if (statusInfo == null) {
      return 0;
    } else {
      return statusInfo.free;
    }
  };

  // TODO 別ファイルに分ける
  // TODO きれいに表示する
  const userInfoComponent = (date: Date): JSX.Element => {
    const dateTime = date.getTime();
    const statusInfo = dateToStatusInfoList[dateTime];
    const userStatusComponents = users.map((user) => {
      if (statusInfo == null) {
        return <div key={user.id}>{user.name}: 未入力</div>;
      } else {
        const status = statusInfo.usersStatus[user.id];
        if (status == null) {
          return <div key={user.id}>{user.name}: 未入力</div>;
        } else {
          const statusText = status == "calendar-free" ? "〇" : "×";
          return (
            <div key={user.id}>
              {user.name}: {statusText}
            </div>
          );
        }
      }
    });
    if (statusInfo == null) {
      return (
        <React.Fragment>
          <p>{date.toString()}</p>
          <p>暇な人: {0}</p>
          <p>忙しい人: {0}</p>
          {userStatusComponents}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <p>{date.toString()}</p>
          <p>暇な人: {statusInfo.free}</p>
          <p>忙しい人: {statusInfo.busy}</p>
          {userStatusComponents}
        </React.Fragment>
      );
    }
  };
  return (
    <React.Fragment>
      <div
        onClick={() => {
          setShowUserInfo(false);
          setFocusedDate(null);
        }}
      >
        {focusedDate && userInfoComponent(focusedDate)}
      </div>
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
    </React.Fragment>
  );
};
