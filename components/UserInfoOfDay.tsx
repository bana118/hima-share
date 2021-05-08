import { DateTimeToStatusInfoList } from "interfaces/DateStatus";
import { UserWithId } from "interfaces/User";
import React from "react";

interface UserInfoOfDayProps {
  date: Date | null;
  users: UserWithId[];
  dateToStatusInfoList: DateTimeToStatusInfoList;
  close: () => void;
}

export const UserInfoOfDay = ({
  date,
  users,
  dateToStatusInfoList,
  close,
}: UserInfoOfDayProps): JSX.Element => {
  if (date == null) {
    return <React.Fragment />;
  }
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
  const dayFormat = (day: number) => {
    switch (day) {
      case 0:
        return "日";
      case 1:
        return "月";
      case 2:
        return "火";
      case 3:
        return "水";
      case 4:
        return "木";
      case 5:
        return "金";
      case 6:
        return "土";
      default:
        return "Unexpected Error";
    }
  };
  const dateString = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}(${dayFormat(
    date.getDay()
  )})`;
  if (statusInfo == null) {
    return (
      <div onClick={close}>
        <p>{dateString}</p>
        <p>暇な人: {0}</p>
        <p>忙しい人: {0}</p>
        {userStatusComponents}
      </div>
    );
  } else {
    return (
      <div onClick={close}>
        <p>{dateString}</p>
        <p>暇な人: {statusInfo.free}</p>
        <p>忙しい人: {statusInfo.busy}</p>
        {userStatusComponents}
      </div>
    );
  }
};
