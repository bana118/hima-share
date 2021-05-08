import Link from "next/link";
import React from "react";
import { useContext, useEffect, useState } from "react";
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
  useEffect(() => {
    // コンポーネントが削除された後にsetDateStatusListが呼ばれないようにするため
    let unmounted = false;
    const setFromDatabase = async () => {
      if (authUser == null) {
        if (!unmounted) {
          setDateStatusList(null);
        }
      } else {
        // TODO エラー処理
        const data = await loadDateStatusList(authUser.uid);
        if (data != null && !unmounted) {
          setDateStatusList(data);
        } else if (data == null && !unmounted) {
          setDateStatusList({});
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
      {dateStatusList === null && (
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
      {dateStatusList && (
        <Layout title="ユーザーカレンダー">
          <h1>ユーザーカレンダー</h1>
          <p>あなたの予定</p>
          <UserCalendar
            dateStatusList={dateStatusList}
            setDateStatusList={(list) => setDateStatusList(list)}
          />
        </Layout>
      )}
    </React.Fragment>
  );
};

export default IndexPage;
