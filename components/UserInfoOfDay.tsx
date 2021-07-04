import { DateTimeToStatusInfoList } from "interfaces/DateStatus";
import { UserWithId } from "interfaces/User";
import React from "react";
import { Button, Card, Table } from "react-bootstrap";
import { EventMessage } from "./EventMessage";

interface UserInfoOfDayProps {
  date: Date | null;
  groupId: string;
  invitationId?: string;
  users: UserWithId[];
  dateToStatusInfoList: DateTimeToStatusInfoList;
  close: () => void;
}

export const UserInfoOfDay = ({
  date,
  groupId,
  invitationId,
  users,
  dateToStatusInfoList,
  close,
}: UserInfoOfDayProps): JSX.Element => {
  if (date == null) {
    return <React.Fragment />;
  }
  const dateTime = date.getTime();
  const statusInfo = dateToStatusInfoList[dateTime];
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

  const dateText = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}(${dayFormat(
    date.getDay()
  )})`;

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
