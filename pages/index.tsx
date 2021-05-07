import Link from "next/link";
import React, { useEffect, useContext, useState } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { GroupWithId, loadGroup } from "../interfaces/Group";
import { loadUser, User } from "../interfaces/User";

const IndexPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [groups, setGroups] = useState<GroupWithId[] | null | undefined>(
    undefined
  );

  // TODO よく使う処理なのでカスタムフックにする
  useEffect(() => {
    // コンポーネントが削除された後にsetDateStatusListが呼ばれないようにするため
    let unmounted = false;
    const setFromDatabase = async () => {
      if (authUser == null) {
        if (!unmounted) {
          setUser(null);
          setGroups(null);
        }
      } else {
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

  // デバッグ用にユーザー情報を表示
  // TODO ユーザーページにはSSRを使用
  return (
    <Layout title="Hima Share">
      <h1>Hello Hima Share 👋</h1>
      {user && groups && (
        <React.Fragment>
          <p>User info</p>
          <p>name: {user.name}</p>
          <p>email: {user.email}</p>
          {groupListComponent(groups)}
          <p>
            <Link href="/calendar">
              <a>カレンダー</a>
            </Link>
          </p>
          <p>
            <Link href="/create-group">
              <a>グループ作成</a>
            </Link>
          </p>
        </React.Fragment>
      )}
      {user === null && (
        <React.Fragment>
          <p className="text-main font-weight-bold">
            You are not logged in yet
          </p>
          <p>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </p>
          <p>
            <Link href="/register">
              <a>Register</a>
            </Link>
          </p>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default IndexPage;
