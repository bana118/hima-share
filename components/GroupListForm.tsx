import { AuthContext } from "context/AuthContext";
import { GroupWithId } from "interfaces/Group";
import { updateUser, UserWithId, User } from "interfaces/User";
import Link from "next/link";
import { useState, useRef, useContext } from "react";
import { Table, Button, Overlay, Tooltip, Form, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

interface GroupListFormProps {
  user: UserWithId;
  groups: GroupWithId[];
}

interface InputsType {
  chatId: string;
}

export const GroupListForm = ({
  user,
  groups,
}: GroupListFormProps): JSX.Element => {
  const { authUser } = useContext(AuthContext);

  const itemsComponent = groups.map((group) => {
    const initChatId = user.groups == null ? "" : user.groups[group.id];
    const updateButtonRef = useRef(null);
    const [showTooltip, setShowTooltip] = useState(false);
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
        const newChatId = data["chatId"];
        const newUser: User = {
          ...user,
          groups: { ...user.groups, [group.id]: newChatId },
        };
        updateUser(newUser, user.id)
          .then(() => {
            setShowTooltip(true);
          })
          .catch(() => {
            setUnexpectedError();
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
          <Button variant="main">退会</Button>
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
