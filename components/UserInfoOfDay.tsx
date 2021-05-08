import { DateTimeToStatusInfoList } from "interfaces/DateStatus";
import { UserWithId } from "interfaces/User";
import React from "react";

interface UserInfoOfDayProps {
  date: Date;
  users: UserWithId[];
  dateToStatusInfoList: DateTimeToStatusInfoList;
}

export const UserInfoOfDay = ({
  date,
  users,
  dateToStatusInfoList,
}: UserInfoOfDayProps): JSX.Element => {
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
