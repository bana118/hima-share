import Link from "next/link";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { ErrorPage } from "../../components/ErrorPage";
import { GroupWithId, loadGroup } from "../../interfaces/Group";
import { useContext, useState } from "react";
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
  initGroup?: GroupWithId;
  initGroupDateStatusList?: UserDateStatusList[];
  errors?: string;
};

const GroupCalendarPage = ({
  initGroup,
  initGroupDateStatusList,
  errors,
}: Props): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [group, setGroup] = useState(initGroup);
  const [groupDateStatusList, setGroupDateStatusList] = useState(
    initGroupDateStatusList
  );

  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  if (!group || !groupDateStatusList) {
    return <ErrorPage />;
  }
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

  const reload = async () => {
    const newGroup = await loadGroup(group.id);
    if (newGroup != null && newGroup.members != null) {
      const userIds = Object.keys(newGroup.members);
      const newGroupDateStatusList = [];
      for (const userId of userIds) {
        const user = await loadUser(userId);
        const userDateStatusList = await loadDateStatusList(userId);
        if (user == null) {
          return { props: { errors: "Unexpected Error" } };
        }
        newGroupDateStatusList.push({
          user: user,
          dateStatusList: userDateStatusList,
        });
      }
      setGroup(newGroup);
      setGroupDateStatusList(newGroupDateStatusList);
    }
  };

  return (
    <React.Fragment>
      {groupDateStatusList && group && (
        <Layout title={group.name}>
          <Button variant="accent" type="button" onClick={reload}>
            更新
          </Button>
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
    const initGroup = await loadGroup(groupId);
    if (initGroup == null || initGroup.members == null) {
      return { props: { errors: "Invalid URL" } };
    } else {
      const userIds = Object.keys(initGroup.members);
      const initGroupDateStatusList: UserDateStatusList[] = [];
      for (const userId of userIds) {
        const user = await loadUser(userId);
        const userDateStatusList = await loadDateStatusList(userId);
        if (user == null) {
          return { props: { errors: "Unexpected Error" } };
        }
        initGroupDateStatusList.push({
          user: user,
          dateStatusList: userDateStatusList,
        });
      }
      return { props: { initGroup, initGroupDateStatusList } };
    }
  }
};
