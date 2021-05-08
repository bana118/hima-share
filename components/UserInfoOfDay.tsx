import { DateTimeToStatusInfoList } from "interfaces/DateStatus";
import { UserWithId } from "interfaces/User";
import React from "react";
import { Button, Card, Table } from "react-bootstrap";
import { EventMessage } from "./EventMessage";

interface UserInfoOfDayProps {
  date: Date | null;
  groupId: string;
  users: UserWithId[];
  dateToStatusInfoList: DateTimeToStatusInfoList;
  close: () => void;
}

export const UserInfoOfDay = ({
  date,
  groupId,
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
        <td>{chatId}</td>
      </tr>
    );
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
              <th>チャットID</th>
            </tr>
          </thead>
          <tbody>{userStatusComponents}</tbody>
        </Table>
      </Card.Body>
      <Card.Footer>
        <EventMessage users={users} />
      </Card.Footer>
    </Card>
  );
};
