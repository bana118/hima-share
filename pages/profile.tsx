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

  // TODO よく使う処理なのでカスタムフックにする
  useEffect(() => {
    // コンポーネントが削除された後にsetDateStatusListが呼ばれないようにするため
    let unmounted = false;
    const setFromDatabase = async () => {
      if (authUser === null) {
        Router.push("/login");
      } else if (authUser != null) {
        // TODO エラー処理
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
      {user && groups && (
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
            <Button variant="accent" type="button">
              更新
            </Button>
          </Row>
          <Row className="justify-content-center mt-3">
            <h2>パスワード</h2>
          </Row>
          <Row className="justify-content-center">
            <p>更新するには再度ログインする必要があります</p>
          </Row>
          <Row className="justify-content-center">
            <Button variant="accent" type="button">
              更新
            </Button>
          </Row>
        </Layout>
      )}
    </React.Fragment>
  );
};

export default ProfilePage;
