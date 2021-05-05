import Link from "next/link";
import Router from "next/router";
import React from "react";
import { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { UserCalendar } from "../components/UserCalendar";
import { AuthContext } from "../context/AuthContext";
import {
  DateStatus,
  loadDateStatusList,
  storeDateStatusList,
} from "../interfaces/DateStatus";

const UserCalendarPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [dateStatusList, setDateStatusList] = useState<
    DateStatus[] | undefined
  >(undefined);
  useEffect(() => {
    // コンポーネントが削除された後にsetDateStatusListが呼ばれないようにするため
    let unmounted = false;
    const setFromDatabase = async () => {
      if (authUser == null) {
        Router.push("/login");
      } else {
        // TODO エラー処理
        const data = await loadDateStatusList(authUser.uid);
        if (data != null && !unmounted) {
          setDateStatusList(data);
        } else if (data == null && !unmounted) {
          setDateStatusList([]);
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
      {authUser && dateStatusList && (
        <Layout title="カレンダー入力">
          <h1>カレンダー入力</h1>
          <p>カレンダーに予定を設定しよう！</p>
          <UserCalendar
            dateStatusList={dateStatusList}
            setDateStatusList={(list) => setDateStatusList(list)}
          />
          <p>
            <Link href="/">
              <a>ホーム</a>
            </Link>
          </p>
        </Layout>
      )}
    </React.Fragment>
  );
};

export default UserCalendarPage;
