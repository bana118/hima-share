import { Form, Button } from "react-bootstrap";
import Router from "next/router";
import { GroupWithId } from "../interfaces/Group";
import { Invitation, storeInvitation } from "../interfaces/Invitation";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";

type Props = {
  authUser: firebase.User;
  group: GroupWithId;
};

// 現在入力はないがreact-hook-formを用いるために必要
type InputsType = {
  empty: undefined;
};

export const CreateInvitationForm = ({
  authUser,
  group,
}: Props): JSX.Element => {
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<InputsType>();
  const setUnexpectedError = () => {
    setError("empty", {
      type: "manual",
      message: "予期せぬエラーが発生しました！ もう一度お試しください",
    });
  };

  const createInvitation = async () => {
    if (authUser == null) {
      Router.push("/login");
    } else {
      const invitation: Invitation = {
        groupId: group.id,
      };
      storeInvitation(invitation, group.id)
        .then((invitationId) => {
          Router.push(`/invitations/${invitationId}`);
        })
        .catch(() => {
          setUnexpectedError();
        });
    }
  };
  // TODO 招待の期限を設定
  return (
    <Form onSubmit={handleSubmit(createInvitation)}>
      <p>{group.name}への招待リンクを作成できます</p>
      <p>招待リンクはグループ参加者なら誰でも無効にすることができます</p>
      {errors.empty && (
        <Form.Control.Feedback type="invalid">
          {errors.empty.message}
        </Form.Control.Feedback>
      )}
      <Button variant="accent" type="submit">
        招待リンクを作成
      </Button>
    </Form>
  );
};
