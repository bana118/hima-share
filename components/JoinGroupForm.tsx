import { Form, Button } from "react-bootstrap";
import Router from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { GroupWithId } from "../interfaces/Group";
import { useForm } from "react-hook-form";
import { joinGroup, loadUser, UserWithId } from "../interfaces/User";
import Layout from "./Layout";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
  group: GroupWithId;
};

type InputsType = {
  chatId: string;
};

const schema = yup.object().shape({
  chatId: yup.string(),
});

type LoginOrRegister = "login" | "register";

export const JoinGroupForm = ({ group }: Props): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [isAlreadyJoined, setIsAlreadyJoined] = useState<boolean | undefined>(
    undefined
  );
  const [user, setUser] = useState<UserWithId | undefined>(undefined);

  const [loginOrRegister, setLoginOrRegister] = useState<LoginOrRegister>(
    "login"
  );

  // TODO よく使う処理なのでカスタムフックにする
  useEffect(() => {
    // コンポーネントが削除された後にsetDateStatusListが呼ばれないようにするため
    let unmounted = false;
    const setFromDatabase = async () => {
      if (authUser != null) {
        // TODO エラー処理
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
  return (
    <React.Fragment>
      {authUser === null && (
        <Layout title={`${group.name}に参加`}>
          <p>
            グループ: {group.name}に参加するにはログインまたは登録が必要です
          </p>
          <div>
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
          </div>
          {loginOrRegister == "login" && <LoginForm />}
          {loginOrRegister == "register" && <RegisterForm />}
          <Link href="/">
            <a>トップページ</a>
          </Link>
        </Layout>
      )}
      {authUser != null && isAlreadyJoined != null && (
        <React.Fragment>
          {isAlreadyJoined && (
            <Layout title={`すでに${group.name}に参加しています`}>
              <p>{`すでに${group.name}に参加しています!`}</p>
              <Link href="/">
                <a>トップページ</a>
              </Link>
            </Layout>
          )}
          {!isAlreadyJoined && user && (
            <Layout title={`${group.name}に参加`}>
              <Form onSubmit={handleSubmit(confirmJoinGroup)}>
                <p>{user.name} としてログイン中</p>
                <p>グループ: {group.name}に参加しますか？</p>
                <Form.Group>
                  <Form.Label>Chat ID</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.chatId}
                    {...register("chatId")}
                  />
                  {errors.chatId && (
                    <Form.Control.Feedback type="invalid">
                      {errors.chatId.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Button variant="accent" type="submit">
                  参加
                </Button>
              </Form>
              <Link href="/">
                <a>トップページ</a>
              </Link>
            </Layout>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
