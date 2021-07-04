import { Form, Button, Row } from "react-bootstrap";
import Router from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { GroupWithId } from "../interfaces/Group";
import { useForm } from "react-hook-form";
import { joinGroup, loadUser, UserWithId } from "../interfaces/User";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface JoinGroupFormProps {
  group: GroupWithId;
}

interface InputsType {
  chatId: string;
}

const schema = yup.object().shape({
  chatId: yup.string().max(20, "チャットIDは20文字までです"),
});

type LoginOrRegister = "login" | "register";

export const JoinGroupForm = ({ group }: JoinGroupFormProps): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [isAlreadyJoined, setIsAlreadyJoined] = useState<boolean | undefined>(
    undefined
  );
  const [user, setUser] = useState<UserWithId | undefined>(undefined);

  const [loginOrRegister, setLoginOrRegister] =
    useState<LoginOrRegister>("login");

  // TODO よく使う処理なのでカスタムフックにする
  useEffect(() => {
    // コンポーネントが削除された後にsetDateStatusListが呼ばれないようにするため
    let unmounted = false;
    const setFromDatabase = async () => {
      if (authUser != null) {
        try {
          const user = await loadUser(authUser.uid);
          if (user == null) {
            setUnexpectedError();
          } else if (user != null && !unmounted) {
            if (
              user.groups != null &&
              Object.keys(user.groups).includes(group.id)
            ) {
              setIsAlreadyJoined(true);
            } else {
              setIsAlreadyJoined(false);
              setUser(user);
            }
          }
        } catch {
          console.error("Unexpected Error");
        }
      }
    };
    if (authUser !== undefined) {
      setFromDatabase();
    }
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [authUser]);

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
      {authUser === null && (
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
                onClick={() => {
                  setLoginOrRegister("login");
                }}
                checked={loginOrRegister == "login"}
              />
              <Form.Check
                type={"radio"}
                name="loginOrRegister"
                label="登録"
                onClick={() => {
                  setLoginOrRegister("register");
                }}
                checked={loginOrRegister == "register"}
              />
            </Form>
          </Row>

          {loginOrRegister == "login" && (
            <Row className="justify-content-center">
              <LoginForm />
            </Row>
          )}
          {loginOrRegister == "register" && (
            <Row className="justify-content-center">
              <RegisterForm />
            </Row>
          )}
        </React.Fragment>
      )}
      {authUser != null && isAlreadyJoined != null && (
        <React.Fragment>
          {isAlreadyJoined && (
            <Row className="justify-content-center">
              <p>{`すでに${group.name}に参加しています!`}</p>
            </Row>
          )}
          {!isAlreadyJoined && user && (
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
