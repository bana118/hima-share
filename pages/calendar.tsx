import Link from "next/link";
import Router from "next/router";
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
  const authContext = useContext(AuthContext);
  const { user, isLoading } = authContext;
  const [dateStatusList, setDateStatusList] = useState<DateStatus[]>([]);
  useEffect(() => {
    // コンポーネントが削除された後にsetDateStatusListが呼ばれないようにするため
    let unmounted = false;
    const setFromDatabase = async () => {
      if (user == null) {
        Router.push("/login");
      } else {
        // TODO エラー処理
        const data = await loadDateStatusList(user.uid);
        if (data != null && !unmounted) {
          setDateStatusList(data);
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
  useEffect(() => {
    const setToDatabase = async () => {
      if (user == null) {
        Router.push("/login");
      } else {
        // TODO エラー処理
        await storeDateStatusList(dateStatusList, user.uid);
      }
    };
    if (!isLoading) {
      setToDatabase();
    }
  }, [dateStatusList]);
  return (
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
  );
};

export default UserCalendarPage;
