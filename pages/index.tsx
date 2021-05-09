import { GroupList } from "components/GroupList";
import { GroupWithId, loadGroup } from "interfaces/Group";
import { loadUser, UserWithId } from "interfaces/User";
import Link from "next/link";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import Layout from "../components/Layout";
import { UserCalendar } from "../components/UserCalendar";
import { AuthContext } from "../context/AuthContext";
import {
  DateStatusList,
  loadDateStatusList,
  storeDateStatusList,
} from "../interfaces/DateStatus";

const IndexPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [dateStatusList, setDateStatusList] = useState<
    DateStatusList | undefined | null
  >(undefined);
  const [user, setUser] = useState<UserWithId | undefined | null>(undefined);
  const [groups, setGroups] = useState<GroupWithId[] | undefined | null>(
    undefined
  );
  useEffect(() => {
    // コンポーネントが削除された後にsetDateStatusListが呼ばれないようにするため
    let unmounted = false;
    const setFromDatabase = async () => {
      if (authUser == null) {
        if (!unmounted) {
          setDateStatusList(null);
          setUser(null);
          setGroups(null);
        }
      } else {
        // TODO エラー処理
        const [userData, data] = await Promise.all([
          loadUser(authUser.uid),
          loadDateStatusList(authUser.uid),
        ]);
        if (!unmounted) {
          if (data != null) {
            setDateStatusList(data);
          } else {
            setDateStatusList({});
          }
          if (userData != null) {
            setUser(userData);
            const groupList: GroupWithId[] = [];
            if (userData.groups != null) {
              const groupIds = Object.keys(userData.groups);
              const groupsData = await Promise.all(
                groupIds.map((groupId) => loadGroup(groupId))
              );
              for (const groupData of groupsData) {
                if (groupData != null) {
                  groupList.push(groupData);
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

  useEffect(() => {
    const setToDatabase = async () => {
      if (authUser != null && dateStatusList != null) {
        // TODO エラー処理
        // TODO 失敗したらカレンダーの色は変えない
        await storeDateStatusList(dateStatusList, authUser.uid);
      }
    };
    if (authUser !== undefined) {
      setToDatabase();
    }
  }, [dateStatusList]);

  return (
    <React.Fragment>
      {(dateStatusList === null || user === null || groups === null) && (
        <Layout title="Hima Share">
          <h1>Hello Hima Share 👋</h1>
          <h2>トップページ制作中...</h2>
          <p>
            <Link href="/login">
              <a>ログイン</a>
            </Link>
          </p>
          <p>
            <Link href="/register">
              <a>登録</a>
            </Link>
          </p>
        </Layout>
      )}
      {dateStatusList && user && groups && (
        <Layout title="ユーザーカレンダー">
          <Row className="justify-content-center">
            <h1>{user.name}のカレンダー</h1>
          </Row>
          <Row className="justify-content-center">
            <p>あなたの予定を入力しましょう</p>
          </Row>
          <Row className="justify-content-center">
            <UserCalendar
              dateStatusList={dateStatusList}
              setDateStatusList={(list) => setDateStatusList(list)}
            />
          </Row>
          <Row className="justify-content-center">
            <Link href="/create-group">
              <a>グループ作成</a>
            </Link>
          </Row>
          <Row className="justify-content-center">
            <h2>グループ一覧</h2>
          </Row>
          <Row className="justify-content-center">
            <GroupList groups={groups} />
          </Row>
        </Layout>
      )}
    </React.Fragment>
  );
};

export default IndexPage;
