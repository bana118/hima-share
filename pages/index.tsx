import { AboutPage } from "components/AboutPage";
import { ErrorPage } from "components/ErrorPage";
import { GroupList } from "components/GroupList";
import { LoaingPage } from "components/LoadingPage";
import { NextSeo } from "next-seo";
import { WeekDayButtons } from "components/WeekDayButtons";
import { useAsync } from "hooks/useAsync";
import { loadUserAndGroups } from "interfaces/User";
import Link from "next/link";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { isUidString } from "utils/type-guard";
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

  const userAndGroups = useAsync(loadUserAndGroups, authUser?.uid, isUidString);
  const initDateStatusList = useAsync(
    loadDateStatusList,
    authUser?.uid,
    isUidString
  );

  const [dateStatusList, setDateStatusList] = useState<
    DateStatusList | null | undefined
  >(undefined);

  useEffect(() => {
    if (authUser != null && !authUser.emailVerified) {
      Router.push("/email-verify");
    }
  }, [authUser]);

  useEffect(() => {
    setDateStatusList(initDateStatusList.data);
  }, [initDateStatusList.data]);

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

  if (authUser === undefined || (authUser != null && !authUser.emailVerified)) {
    return <LoaingPage />;
  }

  if (authUser === null) {
    return <AboutPage />;
  }

  if (userAndGroups.data === undefined || dateStatusList === undefined) {
    return <LoaingPage />;
  }

  if (userAndGroups.data === null || dateStatusList === null) {
    return <ErrorPage />;
  }

  return (
    <Layout>
      <NextSeo title={`${userAndGroups.data.user.name}のカレンダー`} />
      <Row className="justify-content-center">
        <h1>{userAndGroups.data.user.name}</h1>
      </Row>
      <Row className="justify-content-center">
        <p className="text-muted">日付，曜日ボタンをクリックして</p>
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
        <GroupList groups={userAndGroups.data.groups} />
      </Row>
    </Layout>
  );
};

export default IndexPage;
