import {
  dateTimeToWeekDay,
  StatusInfo,
  UserDateStatusList,
} from "interfaces/DateStatus";
import React from "react";
import { Button, Card, Table } from "react-bootstrap";
import { EventMessage } from "./EventMessage";

type UserInfoOfDayProps = {
  date: Date | null;
  groupId: string;
  invitationId?: string;
  groupDateStatusList: UserDateStatusList[];
  close: () => void;
};

export const UserInfoOfDay = ({
  date,
  groupId,
  invitationId,
  groupDateStatusList,
  close,
}: UserInfoOfDayProps): JSX.Element => {
  if (date == null) {
    return <React.Fragment />;
  }
  const users = groupDateStatusList.map(
    (groupDateStatus) => groupDateStatus.user
  );
  const dateTime = date.getTime();
  const weekDay = dateTimeToWeekDay(dateTime);
  const statusInfo: StatusInfo = {
    free: 0,
    busy: 0,
    usersStatus: {},
  };
  for (const userDateStatusList of groupDateStatusList) {
    const user = userDateStatusList.user;
    const dateStatusList = userDateStatusList.dateStatusList;
    const status = dateStatusList[dateTime] || dateStatusList[weekDay];
    if (status == "calendar-free") {
      statusInfo.free += 1;
    } else if (status == "calendar-busy") {
      statusInfo.busy += 1;
    }
    if (status != null) {
      statusInfo.usersStatus[user.id] = status;
    }
  }
  const unEnteredText = "未入力";
  const freeText = "〇";
  const busyText = "×";
  const errorText = "エラー！";

  const userStatusComponents = users.map((user) => {
    const statusText = () => {
      if (statusInfo == null) return unEnteredText;
      const status = statusInfo.usersStatus[user.id];
      if (status == null) {
        return unEnteredText;
      } else if (status == "calendar-free") {
        return freeText;
      } else if (status == "calendar-busy") {
        return busyText;
      } else {
        return errorText;
      }
    };
    const chatId = user.groups == null ? "" : user.groups[groupId];
    return (
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>{statusText()}</td>
        <td>{user.description}</td>
        <td>{chatId}</td>
      </tr>
    );
  });

  const freeUsers = users.filter((user) => {
    if (statusInfo == null) return false;
    const status = statusInfo.usersStatus[user.id];
    return status == "calendar-free";
  });
  const freeChatIds = freeUsers
    .map((freeUser) => {
      return freeUser.groups == null ? null : freeUser.groups[groupId];
    })
    .filter<string>((chatId): chatId is string => chatId != null);

  const unEnteredUsers = users.filter((user) => {
    if (statusInfo == null) return true;
    const status = statusInfo.usersStatus[user.id];
    return status == null;
  });
  const unEnteredChatIds = unEnteredUsers
    .map((unEnteredUser) => {
      return unEnteredUser.groups == null
        ? null
        : unEnteredUser.groups[groupId];
    })
    .filter<string>((chatId): chatId is string => chatId != null);

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

  const dateText = `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()}(${dayFormat(date.getDay())})`;

  const cardTitleText =
    statusInfo == null
      ? `暇な人: 0 忙しい人: 0`
      : `暇な人: ${statusInfo.free} 忙しい人: ${statusInfo.busy}`;

  return (
    <Card>
      <Card.Header as="h4">
        <Button
          className="float-left mr-3"
          onClick={close}
          size="sm"
          variant="main"
        >
          <span aria-hidden="true">戻る</span>
        </Button>
        {dateText}
      </Card.Header>
      <Card.Body>
        <Card.Title>{cardTitleText}</Card.Title>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ユーザー名</th>
              <th>予定</th>
              <th>プロフィール</th>
              <th>チャットID</th>
            </tr>
          </thead>
          <tbody>{userStatusComponents}</tbody>
        </Table>
      </Card.Body>
      <Card.Footer>
        <EventMessage
          dateText={dateText}
          freeChatIds={freeChatIds}
          unEnteredChatIds={unEnteredChatIds}
          invitationId={invitationId}
        />
      </Card.Footer>
    </Card>
  );
};
