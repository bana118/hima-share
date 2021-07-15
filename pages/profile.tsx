import { DeleteUserButton } from "components/DeleteUserButton";
import { GroupListForm } from "components/GroupListForm";
import { LoginForm } from "components/LoginForm";
import { UpdateEmailForm } from "components/UpdateEmailForm";
import { UpdatePasswordForm } from "components/UpdatePasswordForm";
import { UpdateUserForm } from "components/UpdateUserForm";
import Router from "next/router";
import Link from "next/link";
import React, { useEffect, useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Layout } from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { GroupWithId } from "../interfaces/Group";
import { loadUserAndGroups } from "../interfaces/User";
import { MyHead } from "components/MyHead";
import firebase from "firebase/app";
import {
  getProviderUserData,
  linkWithGoogle,
  loginWithGoogle,
} from "utils/auth-provider";
import { useAsync } from "hooks/useAsync";
import { isUidString } from "utils/type-guard";
import { LoaingPage } from "components/LoadingPage";
import { ErrorPage } from "components/ErrorPage";

const ProfilePage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);

  const userAndGroups = useAsync(loadUserAndGroups, authUser?.uid, isUidString);

  const [groups, setGroups] = useState<GroupWithId[] | null | undefined>(
    undefined
  );

  const [onLoginedAction, setOnLoginedAction] = useState<
    | "updateEmail"
    | "updatePassword"
    | "deleteUser"
    | "linkWithGoogle"
    | undefined
  >(undefined);
  const [readyUpdateEmail, setReadyUpdateEmail] = useState(false);
  const [readyUpdatePassword, setReadyUpdatePassword] = useState(false);
  const [readyDeleteUser, setReadyDeleteUser] = useState(false);
  const [updated, setUpdated] = useState<
    "updateEmail" | "updatePassword" | undefined
  >(undefined);
  const [passwordUserData, setPasswordUserData] = useState<
    firebase.UserInfo | undefined | null
  >(undefined);
  const [googleUserData, setGoogleUserData] = useState<
    firebase.UserInfo | undefined | null
  >(undefined);

  useEffect(() => {
    if (authUser === null) {
      Router.push("/login");
    } else if (authUser != null) {
      setPasswordUserData(getProviderUserData(authUser, "password"));
      setGoogleUserData(getProviderUserData(authUser, "google.com"));
    }
  }, [authUser]);

  useEffect(() => {
    if (userAndGroups.data === undefined) {
      setGroups(undefined);
    } else if (userAndGroups.data === null) {
      setGroups(null);
    } else {
      setGroups(userAndGroups.data.groups);
    }
  }, [userAndGroups.data]);

  if (
    authUser == null ||
    userAndGroups.data === undefined ||
    groups === undefined
  ) {
    return <LoaingPage />;
  }

  if (userAndGroups.data === null || groups === null) {
    return <ErrorPage />;
  }

  return (
    <Layout>
      {updated && (
        <React.Fragment>
          <MyHead title="更新完了" />
          <Row className="justify-content-center">
            <h2>
              {updated == "updateEmail" && "メールアドレスを更新しました"}
              {updated == "updatePassword" && "パスワードを更新しました"}
            </h2>
            {updated == "updateEmail" && (
              <h3>確認メール内のリンクをクリックして下さい</h3>
            )}
          </Row>
          <Row className="justify-content-center">
            <Button
              variant="accent"
              type="button"
              onClick={() => {
                setUpdated(undefined);
                setOnLoginedAction(undefined);
              }}
            >
              戻る
            </Button>
          </Row>
        </React.Fragment>
      )}
      {readyUpdateEmail && (
        <React.Fragment>
          <MyHead title="メールアドレス更新" />
          <Row className="justify-content-center">
            <UpdateEmailForm
              onUpdated={() => {
                setReadyUpdateEmail(false);
                setUpdated("updateEmail");
              }}
            />
          </Row>
        </React.Fragment>
      )}
      {readyUpdatePassword && (
        <React.Fragment>
          <MyHead title="パスワード更新" />
          <Row className="justify-content-center">
            <UpdatePasswordForm
              onUpdated={() => {
                setReadyUpdatePassword(false);
                setUpdated("updatePassword");
              }}
            />
          </Row>
        </React.Fragment>
      )}
      {readyDeleteUser && (
        <React.Fragment>
          <MyHead title="ユーザー削除" />
          <Row className="justify-content-center">
            <h2>本当に{userAndGroups.data.user.name}を削除しますか？</h2>
          </Row>
          <Row className="justify-content-center">
            <DeleteUserButton
              user={userAndGroups.data.user}
              onDeleted={() => {
                Router.push("/");
              }}
            />
          </Row>
          <Row className="justify-content-center mt-3">
            <a
              href="#"
              onClick={() => {
                setOnLoginedAction(undefined);
                setReadyDeleteUser(false);
              }}
            >
              戻る
            </a>
          </Row>
        </React.Fragment>
      )}
      {onLoginedAction != null &&
        !readyUpdateEmail &&
        !readyUpdatePassword &&
        !readyDeleteUser &&
        !updated && (
          <React.Fragment>
            <MyHead title="ログイン" />
            <Row className="justify-content-center">
              {passwordUserData != null && (
                <LoginForm
                  onLogined={() => {
                    if (onLoginedAction == "updateEmail") {
                      setReadyUpdateEmail(true);
                    } else if (onLoginedAction == "updatePassword") {
                      setReadyUpdatePassword(true);
                    } else if (onLoginedAction == "deleteUser") {
                      setReadyDeleteUser(true);
                    } else {
                      if (authUser != null) {
                        linkWithGoogle(authUser);
                      } else {
                        Router.push("/login");
                      }
                    }
                  }}
                />
              )}
              {passwordUserData === null && (
                <React.Fragment>
                  <a
                    href="#"
                    onClick={() => {
                      window.history.replaceState(null, "", "/create-password");
                      loginWithGoogle();
                    }}
                  >
                    パスワードの設定
                  </a>
                  が必要です
                </React.Fragment>
              )}
            </Row>
            <Row className="justify-content-center">
              <a
                href="#"
                onClick={() => {
                  setOnLoginedAction(undefined);
                }}
              >
                戻る
              </a>
            </Row>
          </React.Fragment>
        )}
      {onLoginedAction == null && (
        <React.Fragment>
          <MyHead title="ユーザー情報" />
          <Row className="justify-content-center">
            <Link href="/">
              <a>戻る</a>
            </Link>
          </Row>
          <Row className="justify-content-center">
            <h2>ユーザー情報</h2>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <UpdateUserForm
                user={userAndGroups.data.user}
                defaultValues={{
                  name: userAndGroups.data.user.name,
                  description: userAndGroups.data.user.description,
                }}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <h2>グループ一覧</h2>
          </Row>
          <Row>
            <GroupListForm
              user={userAndGroups.data.user}
              groups={groups}
              setGroups={(g: GroupWithId[]) => setGroups(g)}
            />
          </Row>
          <Row className="justify-content-center mt-3">
            <h2>Googleアカウント</h2>
          </Row>
          {googleUserData == null && authUser.emailVerified && (
            <React.Fragment>
              <Row className="justify-content-center">
                <p>Googleアカウントとの連携にはログインが必要です</p>
              </Row>
              <Row className="justify-content-center">
                <Button
                  variant="accent"
                  type="button"
                  onClick={() => setOnLoginedAction("linkWithGoogle")}
                >
                  ログイン画面へ
                </Button>
              </Row>
            </React.Fragment>
          )}
          {googleUserData == null && !authUser.emailVerified && (
            <Row className="justify-content-center">
              <p>
                Googleアカウントとの連携には
                <Link href="/email-verify">
                  <a>メールアドレスの確認</a>
                </Link>
                が必要です
              </p>
            </Row>
          )}
          {googleUserData != null && passwordUserData != null && (
            <React.Fragment>
              <Row className="justify-content-center">
                <p>Googleアカウントと連携しています</p>
              </Row>
              <Row className="justify-content-center">
                <Button
                  variant="main"
                  type="button"
                  onClick={() => {
                    authUser
                      .unlink("google.com")
                      .then(() => {
                        Router.reload();
                      })
                      .catch(() => {
                        console.error("Unexpected Error");
                      });
                  }}
                >
                  Googleアカウントとの連携を解除
                </Button>
              </Row>
            </React.Fragment>
          )}
          {googleUserData != null && passwordUserData == null && (
            <Row className="justify-content-center">
              <p>
                Googleアカウントとの連携を解除するには
                <a
                  href="#"
                  onClick={() => {
                    window.history.replaceState(null, "", "/create-password");
                    loginWithGoogle();
                  }}
                >
                  パスワードの設定
                </a>
                が必要です
              </p>
            </Row>
          )}
          <Row className="justify-content-center mt-3">
            <h2>メールアドレス</h2>
          </Row>
          <Row className="justify-content-center">
            <p>更新するには再度ログインする必要があります</p>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form.Control
                value={authUser.email != null ? authUser.email : ""}
                readOnly
              />
            </Col>
          </Row>
          {!authUser.emailVerified && (
            <Row className="justify-content-center">
              <Form.Text>
                メールアドレスが未確認です！
                <Link href="/email-verify">
                  <a>確認</a>
                </Link>
                して下さい！
              </Form.Text>
            </Row>
          )}
          <Row className="justify-content-center">
            <Button
              variant="accent"
              type="button"
              onClick={() => setOnLoginedAction("updateEmail")}
            >
              ログイン画面へ
            </Button>
          </Row>
          <Row className="justify-content-center mt-3">
            <h2>パスワード</h2>
          </Row>
          <Row className="justify-content-center">
            <p>更新するには再度ログインする必要があります</p>
          </Row>
          <Row className="justify-content-center">
            <Button
              variant="accent"
              type="button"
              onClick={() => setOnLoginedAction("updatePassword")}
            >
              ログイン画面へ
            </Button>
          </Row>
          <Row className="justify-content-center mt-3">
            <h2>アカウント削除</h2>
          </Row>
          <Row className="justify-content-center">
            <p>アカウントを削除するには再度ログインする必要があります</p>
          </Row>
          <Row className="justify-content-center">
            <Button
              variant="main"
              type="button"
              onClick={() => setOnLoginedAction("deleteUser")}
            >
              ログイン画面へ
            </Button>
          </Row>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default ProfilePage;
