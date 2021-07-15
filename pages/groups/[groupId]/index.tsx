import { Layout } from "../../../components/Layout";
import { ErrorPage } from "../../../components/ErrorPage";
import {
  GroupWithId,
  loadGroupAndGroupDateStatusList,
} from "../../../interfaces/Group";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import React from "react";
import { UserDateStatusList } from "../../../interfaces/DateStatus";
import { GroupCalendar } from "../../../components/GroupCalendar";
import { Button, Overlay, Row, Tooltip } from "react-bootstrap";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useAsync } from "hooks/useAsync";
import { isQueryString } from "utils/type-guard";
import { LoaingPage } from "components/LoadingPage";

const GroupCalendarPage = (): JSX.Element => {
  const router = useRouter();
  const { groupId } = router.query;

  const { authUser } = useContext(AuthContext);

  const initGroupAndUserDateStatusList = useAsync(
    loadGroupAndGroupDateStatusList,
    groupId,
    isQueryString
  );

  const [group, setGroup] = useState<GroupWithId | null | undefined>(undefined);
  const [groupDateStatusList, setGroupDateStatusList] = useState<
    UserDateStatusList[] | null | undefined
  >(undefined);
  const reloadButtonRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (initGroupAndUserDateStatusList.data === undefined) {
      setGroup(undefined);
      setGroupDateStatusList(undefined);
    } else if (initGroupAndUserDateStatusList.data === null) {
      setGroup(null);
      setGroupDateStatusList(null);
    } else {
      setGroup(initGroupAndUserDateStatusList.data.group);
      setGroupDateStatusList(
        initGroupAndUserDateStatusList.data.groupDateStatusList
      );
    }
  }, [initGroupAndUserDateStatusList.data]);

  if (
    authUser === undefined ||
    group === undefined ||
    groupDateStatusList === undefined
  ) {
    return <LoaingPage />;
  }
  if (
    authUser === null ||
    group === null ||
    group.members == null ||
    !Object.keys(group.members).includes(authUser.uid) ||
    groupDateStatusList === null
  ) {
    return <ErrorPage errorMessage={"Invalid URL"} />;
  }

  // TODO Firebaseのon()メソッドを用いてリアルタイムでカレンダーが変わるようにする
  const reload = async () => {
    try {
      const newGroupAndDateStatusList = await loadGroupAndGroupDateStatusList(
        group.id
      );
      if (newGroupAndDateStatusList != null) {
        setGroup(newGroupAndDateStatusList.group);
        setGroupDateStatusList(newGroupAndDateStatusList.groupDateStatusList);
        setShowTooltip(true);
      } else {
        console.error("Unexpected Error");
      }
    } catch {
      console.error("Unexpected Error");
    }
  };

  return (
    <Layout>
      <NextSeo title={`${group.name}のグループカレンダー`} />
      <Row className="justify-content-center">
        <h2>{group.name}</h2>
      </Row>
      <Row className="justify-content-center">
        <Button
          ref={reloadButtonRef}
          className="m-2"
          variant="accent"
          type="button"
          onClick={reload}
          onBlur={() => {
            setShowTooltip(false);
          }}
        >
          更新
        </Button>
        <Overlay
          target={reloadButtonRef.current}
          show={showTooltip}
          placement="right"
        >
          {(props) => (
            <Tooltip id="update-group-tooltip" {...props}>
              更新しました！
            </Tooltip>
          )}
        </Overlay>
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
    </Layout>
  );
};

export default GroupCalendarPage;
