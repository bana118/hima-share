import Link from "next/link";
import React, { useEffect, useContext, useState } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { GroupWithId, loadGroup } from "../interfaces/Group";
import { loadUser, User } from "../interfaces/User";

const IndexPage = (): JSX.Element => {
  const { authUser, isLoading } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<GroupWithId[] | null>(null);

  useEffect(() => {
    // コンポーネントが削除された後にsetDateStatusListが呼ばれないようにするため
    let unmounted = false;
    const setFromDatabase = async () => {
      if (authUser != null) {
        // TODO エラー処理
        const user = await loadUser(authUser.uid);
        if (user != null && !unmounted) {
          setUser(user);
          const groupIds = Object.keys(user.groups);
          const groupList: GroupWithId[] = [];
          for (const groupId of groupIds) {
            const group = await loadGroup(groupId);
            if (group != null) {
              groupList.push(group);
            }
          }
          if (!unmounted) {
            setGroups(groupList);
          }
        }
      }
    };
    if (!isLoading) {
      setFromDatabase();
    }
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [isLoading]);

  const groupListComponent = (groupList: GroupWithId[] | null): JSX.Element => {
    if (groupList == null) {
      return <React.Fragment />;
    } else {
      const component = groupList.map((g) => {
        console.log(g.id);
        return (
          <div key={g.id}>
            <p>{g.name}</p>
          </div>
        );
      });
      return (
        <React.Fragment>
          <p>groups:</p>
          {component}
        </React.Fragment>
      );
    }
  };

  // デバッグ用にユーザー情報を表示
  return (
    <Layout title="Hima Share">
      <h1>Hello Hima Share 👋</h1>
      {user && (
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
      {!authUser && (
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
