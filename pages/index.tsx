import { About } from "components/About";
import { GroupList } from "components/GroupList";
import { MyHead } from "components/MyHead";
import { WeekDayButtons } from "components/WeekDayButtons";
import { GroupWithId, loadGroup } from "interfaces/Group";
import { loadUser, UserWithId } from "interfaces/User";
import Link from "next/link";
import Router from "next/router";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { Layout } from "../components/Layout";
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
    if (authUser != null && !authUser.emailVerified) {
      Router.push("/email-verify");
    }
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
        try {
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

  useEffect(() => {
    const setToDatabase = async () => {
      if (authUser != null && dateStatusList != null) {
        // TODO 失敗したらカレンダーの色は変えない
        try {
          await storeDateStatusList(dateStatusList, authUser.uid);
        } catch {
          console.error("Unexpected Error");
        }
      }
    };
    if (authUser !== undefined) {
      setToDatabase();
    }
  }, [authUser, dateStatusList]);

  return (
    <Layout>
      {(dateStatusList === null || user === null || groups === null) && (
        <React.Fragment>
          <MyHead title="Hima Share" />
          <About />
        </React.Fragment>
      )}
      {dateStatusList && user && groups && authUser?.emailVerified && (
        <React.Fragment>
          <MyHead title="ユーザーカレンダー" />
          <Row className="justify-content-center">
            <h1>{user.name}</h1>
          </Row>
          <Row className="justify-content-center">
            <p className="text-muted">日付をクリックして</p>
            <p className="text-accent">「暇」</p>
            <p className="text-main">「忙しい」</p>
            <p className="text-muted">「未定」</p>
            <p className="text-muted">を切り替え</p>
          </Row>
          <Row className="justify-content-center">
            <WeekDayButtons
              dateStatusList={dateStatusList}
              setDateStatusList={(list) => setDateStatusList(list)}
            />
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
        </React.Fragment>
      )}
    </Layout>
  );
};

export default IndexPage;
