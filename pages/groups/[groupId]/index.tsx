import { GetServerSideProps } from "next";
import { Layout } from "../../../components/Layout";
import { ErrorPage } from "../../../components/ErrorPage";
import { GroupWithId, loadGroup } from "../../../interfaces/Group";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import React from "react";
import {
  loadDateStatusList,
  UserDateStatusList,
} from "../../../interfaces/DateStatus";
import { GroupCalendar } from "../../../components/GroupCalendar";
import { loadUser } from "../../../interfaces/User";
import { Button, Row } from "react-bootstrap";
import Link from "next/link";
import { MyHead } from "components/MyHead";

type GroupCalendarPageProps = {
  initGroup?: GroupWithId;
  initGroupDateStatusList?: UserDateStatusList[];
  errors?: string;
};

const GroupCalendarPage = ({
  initGroup,
  initGroupDateStatusList,
  errors,
}: GroupCalendarPageProps): JSX.Element => {
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
    try {
      const newGroup = await loadGroup(group.id);
      if (newGroup != null && newGroup.members != null) {
        const userIds = Object.keys(newGroup.members);
        const newGroupDateStatusList = [];

        const usersDateStatusList = await Promise.all(
          userIds.map(async (userId) => {
            return {
              user: await loadUser(userId),
              dateStatusList: await loadDateStatusList(userId),
            };
          })
        );

        for (let i = 0; i < userIds.length; i++) {
          const user = usersDateStatusList[i].user;
          const userDateStatusList = usersDateStatusList[i].dateStatusList;
          if (user == null) {
            return { props: { errors: "Unexpected Error" } };
          }
          newGroupDateStatusList.push({
            user: user,
            dateStatusList: userDateStatusList,
          });
        }
        newGroupDateStatusList.sort((a, b) => {
          const nameA = a.user.name.toUpperCase();
          const nameB = b.user.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

        setGroup(newGroup);
        setGroupDateStatusList(newGroupDateStatusList);
      }
    } catch {
      console.error("Unexpected Error");
    }
  };

  return (
    <Layout>
      {groupDateStatusList && group && (
        <React.Fragment>
          <MyHead title={`${group.name}のカレンダー`} />
          <Row className="justify-content-center">
            <h2>{group.name}のカレンダー</h2>
          </Row>
          <Row className="justify-content-center">
            <Button
              className="m-2"
              variant="accent"
              type="button"
              onClick={reload}
            >
              更新
            </Button>
          </Row>
          <Row className="justify-content-center">
            <GroupCalendar
              groupDateStatusList={groupDateStatusList}
              group={group}
            />
          </Row>
          <Row className="justify-content-center">
            <Link href="/">
              <a>自分のカレンダー</a>
            </Link>
          </Row>
          <Row className="justify-content-center mt-3">
            <Link href={`/groups/${group.id}/settings`}>
              <a>グループの設定</a>
            </Link>
          </Row>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default GroupCalendarPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { groupId } = context.query;
  if (groupId == null || Array.isArray(groupId)) {
    return { props: { errors: "Invalid URL" } };
  } else {
    try {
      const initGroup = await loadGroup(groupId);
      if (initGroup == null || initGroup.members == null) {
        return { props: { errors: "Invalid URL" } };
      } else {
        const userIds = Object.keys(initGroup.members);
        const initGroupDateStatusList: UserDateStatusList[] = [];

        const usersDateStatusList = await Promise.all(
          userIds.map(async (userId) => {
            return {
              user: await loadUser(userId),
              dateStatusList: await loadDateStatusList(userId),
            };
          })
        );
        for (let i = 0; i < userIds.length; i++) {
          const user = usersDateStatusList[i].user;
          const userDateStatusList = usersDateStatusList[i].dateStatusList;
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
    } catch {
      console.error("Unexpected Error");
      return { props: { errors: "Unexpected Error" } };
    }
  }
};
