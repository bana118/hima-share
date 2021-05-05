import { Form, Button } from "react-bootstrap";
import Router from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { GroupWithId } from "../interfaces/Group";
import { useForm } from "react-hook-form";
import { joinGroup, loadUser, UserWithId } from "../interfaces/User";
import Layout from "./Layout";
import Link from "next/link";

type Props = {
  group: GroupWithId;
};

// 現在入力はないがreact-hook-formを用いるために必要
type InputsType = {
  empty: undefined;
};

export const JoinGroupForm = ({ group }: Props): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [isAlreadyJoined, setIsAlreadyJoined] = useState<boolean | undefined>(
    undefined
  );
  const [user, setUser] = useState<UserWithId | undefined>(undefined);

  // TODO よく使う処理なのでカスタムフックにする
  useEffect(() => {
    // コンポーネントが削除された後にsetDateStatusListが呼ばれないようにするため
    let unmounted = false;
    const setFromDatabase = async () => {
      if (authUser == null) {
        Router.push("/login");
      } else {
        // TODO エラー処理
        const user = await loadUser(authUser.uid);
        if (user == null) {
          Router.push("/login");
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

  const confirmJoinGroup = async () => {
    if (authUser == null) {
      Router.push("/login");
    } else {
      if (user == null) {
        setUnexpectedError();
      } else {
        joinGroup(user.id, group.id)
          .then(() => {
            Router.push("/");
          })
          .catch(() => {
            setUnexpectedError();
          });
      }
    }
  };

  // TODO 招待の期限を設定
  return (
    <React.Fragment>
      {isAlreadyJoined != null && (
        <React.Fragment>
          {isAlreadyJoined && (
            <Layout title={`すでに${group.name}に参加しています`}>
              <p>{`すでに${group.name}に参加しています!`}</p>
              <Link href="/">
                <a>トップページ</a>
              </Link>
            </Layout>
          )}
          {!isAlreadyJoined && (
            <Layout title={`${group.name}に参加`}>
              <Form onSubmit={handleSubmit(confirmJoinGroup)}>
                <p>グループ: {group.name}に参加しますか？</p>
                {errors.empty && (
                  <Form.Control.Feedback type="invalid">
                    {errors.empty.message}
                  </Form.Control.Feedback>
                )}
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
