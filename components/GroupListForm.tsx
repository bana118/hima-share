import { AuthContext } from "context/AuthContext";
import { GroupWithId } from "interfaces/Group";
import { UserWithId, updateGroupChatId, leaveGroup } from "interfaces/User";
import Link from "next/link";
import { useState, useRef, useContext } from "react";
import { Table, Button, Overlay, Tooltip, Form, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ConfirmModal } from "./ConfirmModal";

interface GroupListFormProps {
  user: UserWithId;
  groups: GroupWithId[];
  setGroups: (groups: GroupWithId[]) => void;
}

interface InputsType {
  chatId: string;
}

export const GroupListForm = ({
  user,
  groups,
  setGroups,
}: GroupListFormProps): JSX.Element => {
  const { authUser } = useContext(AuthContext);

  const itemsComponent = groups.map((group) => {
    const initChatId = user.groups == null ? "" : user.groups[group.id];
    const updateButtonRef = useRef(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
    } = useForm<InputsType>({
      defaultValues: { chatId: initChatId },
    });
    const setUnexpectedError = () => {
      setError("chatId", {
        type: "manual",
        message: "予期せぬエラーが発生しました！ もう一度お試しください",
      });
    };

    const updateChatId = async (data: InputsType) => {
      if (authUser == null) {
        setUnexpectedError();
      } else {
        updateGroupChatId(user.id, group.id, data["chatId"])
          .then(() => {
            setShowTooltip(true);
          })
          .catch(() => {
            setUnexpectedError();
          });
      }
    };

    const onClickLeaveButton = async () => {
      if (authUser == null) {
        setShowModal(false);
      } else {
        setShowModal(false);
        await leaveGroup(user.id, group).then(() => {
          const index = groups.findIndex((g) => g.id == group.id);
          console.log(index);
          if (index != -1) {
            const newGroups = [...groups];
            setGroups([...newGroups]);
          }
        });
      }
    };
    return (
      <tr key={group.id}>
        <td>
          <Link href={`/groups/${group.id}`}>
            <a>{group.name}</a>
          </Link>
        </td>
        <td>
          <Form onSubmit={handleSubmit(updateChatId)}>
            <Form.Row>
              <Col md={6}>
                <Form.Control
                  isInvalid={!!errors.chatId}
                  {...register("chatId")}
                />
                {errors.chatId && (
                  <Form.Control.Feedback type="invalid">
                    {errors.chatId.message}
                  </Form.Control.Feedback>
                )}
              </Col>
              <Col md={3}>
                <Button
                  ref={updateButtonRef}
                  variant="accent"
                  type="submit"
                  onBlur={() => {
                    setShowTooltip(false);
                  }}
                >
                  更新
                </Button>
                <Overlay
                  target={updateButtonRef.current}
                  show={showTooltip}
                  placement="right"
                >
                  {(props) => (
                    <Tooltip id="update-user-tooltip" {...props}>
                      更新しました！
                    </Tooltip>
                  )}
                </Overlay>
              </Col>
            </Form.Row>
          </Form>
        </td>
        <td>
          <Button variant="main" onClick={() => setShowModal(true)}>
            退会
          </Button>
          <ConfirmModal
            show={showModal}
            setShow={(show: boolean) => setShowModal(show)}
            headerText={`本当に${group.name}から退会しますか？`}
            bodyText={"この操作は取り消せません"}
            confirmButtonText={"退会"}
            onClickConfirmButton={() => onClickLeaveButton()}
          />
        </td>
      </tr>
    );
  });
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>グループ名</th>
          <th>あなたのチャットID</th>
          <th>グループを退会する</th>
        </tr>
      </thead>
      <tbody>{itemsComponent}</tbody>
    </Table>
  );
};
