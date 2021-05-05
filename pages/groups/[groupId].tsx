import Link from "next/link";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { ErrorPage } from "../../components/ErrorPage";
import { GroupWithId, loadGroup } from "../../interfaces/Group";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import React from "react";
import { UserDateStatusList } from "../../interfaces/DateStatus";
import { GroupCalendar } from "../../components/GroupCalendar";

type Props = {
  initGroup?: GroupWithId;
  errors?: string;
};

const GroupCalendarPage = ({ initGroup, errors }: Props): JSX.Element => {
  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  if (!initGroup) {
    return <ErrorPage />;
  }
  const { authUser } = useContext(AuthContext);
  if (authUser === undefined) {
    return <React.Fragment />;
  }
  if (
    authUser === null ||
    initGroup.members == null ||
    !Object.keys(initGroup.members).includes(authUser.uid)
  ) {
    return <ErrorPage errorMessage={"Invalid URL"} />;
  }

  const userIds = Object.keys(initGroup.members);
  const [groupDateStatusList, setGroupDateStatusList] = useState<
    UserDateStatusList[]
  >([]);

  return (
    <Layout title="招待を作成">
      <GroupCalendar groupDateStatusList={groupDateStatusList} />
      <Link href="/">
        <a>戻る</a>
      </Link>
    </Layout>
  );
};

export default GroupCalendarPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { groupId } = context.query;
  if (groupId == null || Array.isArray(groupId)) {
    return { props: { errors: "Invalid URL" } };
  } else {
    const initGroup = await loadGroup(groupId);
    if (initGroup == null) {
      return { props: { errors: "Invalid URL" } };
    } else {
      return { props: { initGroup } };
    }
  }
};
