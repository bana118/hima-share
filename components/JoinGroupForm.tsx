import { Form, Button, Row } from "react-bootstrap";
import Router from "next/router";
import React, { useState } from "react";
import { GroupWithId } from "../interfaces/Group";
import { useForm } from "react-hook-form";
import { joinGroup, UserWithId } from "../interfaces/User";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { GoogleLoginButton } from "./GoogleLoginButton";
import firebase from "firebase/app";

type JoinGroupFormProps = {
  authUser: firebase.User | null;
  user: UserWithId | null | undefined;
  group: GroupWithId;
};

type InputsType = {
  chatId: string;
};

const schema = yup.object().shape({
  chatId: yup.string().max(20, "チャットIDは20文字までです"),
});

export const JoinGroupForm = ({
  authUser,
  user,
  group,
}: JoinGroupFormProps): JSX.Element => {
  const [loginOrRegister, setLoginOrRegister] = useState<"login" | "register">(
    "login"
  );

  const isAlreadyJoined =
    user != null &&
    user.groups != null &&
    Object.keys(user.groups).includes(group.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<InputsType>({ resolver: yupResolver(schema) });
  const setUnexpectedError = () => {
    setError("chatId", {
      type: "manual",
      message: "予期せぬエラーが発生しました！ もう一度お試しください",
    });
  };

  const confirmJoinGroup = async (data: InputsType) => {
    if (user == null) {
      setUnexpectedError();
    } else {
      joinGroup(user.id, group.id, data["chatId"])
        .then(() => {
          Router.push("/");
        })
        .catch(() => {
          setUnexpectedError();
        });
    }
  };

  // TODO 招待の期限を設定
  // TODO コンポーネントにRowを含めないようにしたい
  return (
    <React.Fragment>
      {authUser == null && (
        <React.Fragment>
          <Row className="justify-content-center">
            <Form>
              <p>
                グループ: {group.name}に参加するにはログインまたは登録が必要です
              </p>
              <Form.Check
                type={"radio"}
                name="loginOrRegister"
                label="ログイン"
                onChange={() => setLoginOrRegister("login")}
                defaultChecked
              />
              <Form.Check
                type={"radio"}
                name="loginOrRegister"
                label="登録"
                onChange={() => setLoginOrRegister("register")}
              />
            </Form>
          </Row>
          <Row className="justify-content-center">
            <p>またはGoogleアカウントでログイン</p>
          </Row>
          <Row className="justify-content-center">
            <GoogleLoginButton />
          </Row>
          {loginOrRegister == "login" && (
            <Row className="justify-content-center">
              <LoginForm authUser={authUser} />
            </Row>
          )}
          {loginOrRegister == "register" && (
            <Row className="justify-content-center">
              <RegisterForm />
            </Row>
          )}
        </React.Fragment>
      )}
      {authUser != null && (
        <React.Fragment>
          {isAlreadyJoined && (
            <React.Fragment>
              <Row className="justify-content-center">
                <p>{`すでに${group.name}に参加しています!`}</p>
              </Row>
              <Row className="justify-content-center">
                <Link href={`/groups/${group.id}`}>
                  <a>{group.name}のカレンダー</a>
                </Link>
              </Row>
            </React.Fragment>
          )}
          {!isAlreadyJoined && user != null && (
            <Row className="justify-content-center">
              <Form onSubmit={handleSubmit(confirmJoinGroup)}>
                <p>{user.name} としてログイン中</p>
                <p>グループ: {group.name}に参加しますか？</p>
                <p>グループの説明: {group.description}</p>
                <Form.Group>
                  <Form.Label>チャットID</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.chatId}
                    {...register("chatId")}
                  />
                  {errors.chatId && (
                    <Form.Control.Feedback type="invalid">
                      {errors.chatId.message}
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">最大20文字</Form.Text>
                </Form.Group>
                <Button variant="accent" type="submit">
                  参加
                </Button>
              </Form>
            </Row>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
