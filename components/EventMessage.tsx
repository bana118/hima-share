import { UserWithId } from "interfaces/User";
import React from "react";
import { Button } from "react-bootstrap";

interface EventMessageProps {
  users: UserWithId[];
}

export const EventMessage = ({ users }: EventMessageProps) => {
  return (
    <React.Fragment>
      <p>募集メッセージ</p>
      <Button variant="accent" size="sm">
        コピー
      </Button>
    </React.Fragment>
  );
};
