import { DeleteUserButton } from "components/DeleteUserButton";
import { GroupListForm } from "components/GroupListForm";
import { LoginForm } from "components/LoginForm";
import { UpdateEmailForm } from "components/UpdateEmailForm";
import { UpdatePasswordForm } from "components/UpdatePasswordForm";
import { UpdateUserForm } from "components/UpdateUserForm";
import Router from "next/router";
import React, { useEffect, useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { GroupWithId, loadGroup } from "../interfaces/Group";
import { loadUser, UserWithId } from "../interfaces/User";

const ProfilePage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [user, setUser] = useState<UserWithId | undefined>(undefined);
  const [groups, setGroups] = useState<GroupWithId[] | undefined>(undefined);
  const [onLoginedAction, setOnLoginedAction] = useState<
    "updateEmail" | "updatePassword" | "deleteUser" | undefined
  >(undefined);
  const [readyUpdateEmail, setReadyUpdateEmail] = useState(false);
  const [readyUpdatePassword, setReadyUpdatePassword] = useState(false);
  const [readyDeleteUser, setReadyDeleteUser] = useState(false);
  const [updated, setUpdated] = useState<
    "updateEmail" | "updatePassword" | undefined
  >(undefined);

  // TODO よく使う処理なのでカスタムフックにする
  useEffect(() => {
    // コンポーネントが削除された後にsetDateStatusListが呼ばれないようにするため
    let unmounted = false;
    const setFromDatabase = async () => {
      if (authUser === null) {
        Router.push("/login");
      } else if (authUser != null) {
        try {
          const user = await loadUser(authUser.uid);
          if (user != null && !unmounted) {
            setUser(user);
            const groupList: GroupWithId[] = [];
            if (user.groups != null) {
              const groupIds = Object.keys(user.groups);
              const groupsfromDatabase = await Promise.all(
                groupIds.map((groupId) => loadGroup(groupId))
              );
              for (const group of groupsfromDatabase) {
                if (group != null) {
                  groupList.push(group);
                }
              }
            }
            if (!unmounted) {
              groupList.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });
              setGroups(groupList);
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

  return (
    <React.Fragment>
      {updated && (
        <Layout title="更新完了">
          <Row className="justify-content-center">
            <h2>
              {updated == "updateEmail" && "メールアドレスを更新しました"}
              {updated == "updatePassword" && "パスワードを更新しました"}
            </h2>
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
        </Layout>
      )}
      {readyUpdateEmail && user && (
        <Layout title="メールアドレス更新">
          <Row className="justify-content-center">
            <UpdateEmailForm
              user={user}
              onUpdated={(newEmail) => {
                setReadyUpdateEmail(false);
                const newUser: UserWithId = {
                  ...user,
                  email: newEmail,
                };
                setUser(newUser);
                setUpdated("updateEmail");
              }}
            />
          </Row>
        </Layout>
      )}
      {readyUpdatePassword && user && (
        <Layout title="パスワード更新">
          <Row className="justify-content-center">
            <UpdatePasswordForm
              onUpdated={() => {
                setReadyUpdatePassword(false);
                setUpdated("updatePassword");
              }}
            />
          </Row>
        </Layout>
      )}
      {readyDeleteUser && user && (
        <Layout title="ユーザー削除">
          <Row className="justify-content-center">
            <h2>本当に{user.name}を削除しますか？</h2>
          </Row>
          <Row className="justify-content-center">
            <DeleteUserButton
              user={user}
              onDeleted={() => {
                Router.push("/");
              }}
            />
          </Row>
        </Layout>
      )}
      {onLoginedAction != null &&
        !readyUpdateEmail &&
        !readyUpdatePassword &&
        !readyDeleteUser &&
        !updated && (
          <Layout title="ログイン">
            <Row className="justify-content-center">
              <LoginForm
                onLogined={() => {
                  if (onLoginedAction == "updateEmail") {
                    setReadyUpdateEmail(true);
                  } else if (onLoginedAction == "updatePassword") {
                    setReadyUpdatePassword(true);
                  } else {
                    setReadyDeleteUser(true);
                  }
                }}
              />
            </Row>
          </Layout>
        )}
      {user && groups && onLoginedAction == null && (
        <Layout title={`${user.name}のプロフィール`}>
          <Row className="justify-content-center">
            <h2>ユーザー情報</h2>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <UpdateUserForm
                user={user}
                defaultValues={{
                  name: user.name,
                  description: user.description,
                }}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <h2>グループ一覧</h2>
          </Row>
          <Row>
            <GroupListForm
              user={user}
              groups={groups}
              setGroups={(g: GroupWithId[]) => setGroups(g)}
            />
          </Row>
          <Row className="justify-content-center mt-3">
            <h2>メールアドレス</h2>
          </Row>
          <Row className="justify-content-center">
            <p>更新するには再度ログインする必要があります</p>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form.Control value={user.email} readOnly />
            </Col>
          </Row>
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
        </Layout>
      )}
    </React.Fragment>
  );
};

export default ProfilePage;
