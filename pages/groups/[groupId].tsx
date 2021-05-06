import Link from "next/link";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { ErrorPage } from "../../components/ErrorPage";
import { GroupWithId, loadGroup } from "../../interfaces/Group";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import React from "react";
import {
  loadDateStatusList,
  UserDateStatusList,
} from "../../interfaces/DateStatus";
import { GroupCalendar } from "../../components/GroupCalendar";
import { loadUser } from "../../interfaces/User";
import { Button } from "react-bootstrap";

type Props = {
  group?: GroupWithId;
  groupDateStatusList?: UserDateStatusList[];
  errors?: string;
};

const GroupCalendarPage = ({
  group,
  groupDateStatusList,
  errors,
}: Props): JSX.Element => {
  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  if (!group || !groupDateStatusList) {
    return <ErrorPage />;
  }
  const { authUser } = useContext(AuthContext);
  if (authUser === undefined) {
    return <React.Fragment />;
  }
  if (
    authUser === null ||
    group.members == null ||
    !Object.keys(group.members).includes(authUser.uid)
  ) {
    return <ErrorPage errorMessage={"Invalid URL"} />;
  }

  // TODO Firebaseのon()メソッドを用いてリアルタイムでカレンダーが変わるようにする

  return (
    <React.Fragment>
      {groupDateStatusList && (
        <Layout title={group.name}>
          <GroupCalendar groupDateStatusList={groupDateStatusList} />
          <Link href="/">
            <a>戻る</a>
          </Link>
        </Layout>
      )}
    </React.Fragment>
  );
};

export default GroupCalendarPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { groupId } = context.query;
  if (groupId == null || Array.isArray(groupId)) {
    return { props: { errors: "Invalid URL" } };
  } else {
    const group = await loadGroup(groupId);
    if (group == null || group.members == null) {
      return { props: { errors: "Invalid URL" } };
    } else {
      const userIds = Object.keys(group.members);
      const groupDateStatusList: UserDateStatusList[] = [];
      for (const userId of userIds) {
        const user = await loadUser(userId);
        const userDateStatusList = await loadDateStatusList(userId);
        if (user == null) {
          return { props: { errors: "Unexpected Error" } };
        }
        groupDateStatusList.push({
          user: user,
          dateStatusList: userDateStatusList,
        });
      }
      return { props: { group, groupDateStatusList } };
    }
  }
};
