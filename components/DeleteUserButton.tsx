import { AuthContext } from "context/AuthContext";
import { deleteUser, UserWithId } from "interfaces/User";
import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { ConfirmModal } from "./ConfirmModal";

interface DeleteUserButtonProps {
  user: UserWithId;
  onDeleted?: () => void;
}

export const DeleteUserButton = ({
  user,
  onDeleted,
}: DeleteUserButtonProps): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const onClickDeleteButton = async () => {
    if (authUser == null) {
      console.error("Unexpected Error");
    } else {
      Promise.all([authUser.delete(), deleteUser(user)])
        .then(() => {
          if (onDeleted != null) {
            onDeleted();
          }
        })
        .catch(() => {
          console.error("Unexpected Error");
        });
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
