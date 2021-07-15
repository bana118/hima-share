import { deleteUser, UserWithId } from "interfaces/User";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { ConfirmModal } from "./ConfirmModal";
import firebase from "firebase/app";

interface DeleteUserButtonProps {
  authUser: firebase.User;
  user: UserWithId;
  onDeleted?: () => void;
}

export const DeleteUserButton = ({
  authUser,
  user,
  onDeleted,
}: DeleteUserButtonProps): JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  const onClickDeleteButton = async () => {
    try {
      await authUser.delete();
      await deleteUser(user);
      if (onDeleted != null) {
        onDeleted();
      }
    } catch {
      console.error("Unexpected Error");
    }
  };
  return (
    <React.Fragment>
      <Button variant="main" onClick={() => setShowModal(true)}>
        {user.name}を削除する
      </Button>
      <ConfirmModal
        show={showModal}
        setShow={(show: boolean) => setShowModal(show)}
        headerText={`本当にユーザー: ${user.name}を削除しますか？`}
        bodyText={"※この操作は取り消せません！"}
        confirmButtonText={"削除"}
        onClickConfirmButton={onClickDeleteButton}
      />
    </React.Fragment>
  );
};
