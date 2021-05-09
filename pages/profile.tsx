import { UpdateEmailForm } from "components/UpdateEmailForm";
import { UpdatePasswordForm } from "components/UpdatePasswordForm";
import { UpdateUserForm } from "components/UpdateUserForm";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useContext, useState } from "react";
import { Row } from "react-bootstrap";
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

  const groupListComponent = (groupList: GroupWithId[]): JSX.Element => {
    const component = groupList.map((g) => {
      if (g.invitationId == null) {
        return (
          <div key={g.id}>
            <div>
              <Link href="/groups/[id]" as={`/groups/${g.id}`}>
                <a>{g.name}</a>
              </Link>
            </div>
            <div>
              <Link
                href="/create-invitation/[id]"
                as={`/create-invitation/${g.id}`}
              >
                <a>招待リンク作成</a>
              </Link>
            </div>
          </div>
        );
      } else {
        return (
          <div key={g.id}>
            <div>
              <Link href="/groups/[id]" as={`/groups/${g.id}`}>
                <a>{g.name}</a>
              </Link>
            </div>
            <div>
              <Link
                href="/invitations/[id]"
                as={`/invitations/${g.invitationId}`}
              >
                <a>招待リンク確認</a>
              </Link>
            </div>
          </div>
        );
      }
    });
    return (
      <React.Fragment>
        <p>groups:</p>
        {component}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {user && groups && (
        <Layout title={`${user.name}のプロフィール`}>
          <Row className="justify-content-center">
            <h2>ユーザー情報</h2>
          </Row>
          <Row className="justify-content-center">
            <UpdateUserForm
              user={user}
              defaultValues={{ name: user.name, description: user.description }}
            />
          </Row>
          <Row className="justify-content-center">
            <h2>メールアドレス</h2>
          </Row>
          <Row className="justify-content-center">
            <UpdateEmailForm />
          </Row>
          <Row className="justify-content-center">
            <h2>パスワード</h2>
          </Row>
          <Row className="justify-content-center">
            <UpdatePasswordForm />
          </Row>
          <div>
            <h1>User info</h1>
            <p>name: {user.name}</p>
            <p>email: {user.email}</p>
            <p>description: {user.description}</p>
            {groupListComponent(groups)}
          </div>
        </Layout>
      )}
    </React.Fragment>
  );
};

export default ProfilePage;
