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
import { groupCollapsed } from "node:console";

type GroupSettingsPageProps = {
  group?: GroupWithId;
  errors?: string;
};

const GroupSettingsPage = ({
  group,
  errors,
}: GroupSettingsPageProps): JSX.Element => {
  const { authUser } = useContext(AuthContext);

  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  if (!group) {
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

  return (
    <React.Fragment>
      {group && (
        <Layout title={`${group.name}の設定`}>
          <Row className="justify-content-center">
            <h2>{group.name}の設定</h2>
          </Row>
          <Row className="justify-content-center">
            {group.invitationId && (
              <Link
                href="/invitations/[invitationId]"
                as={`/invitations/${group.invitationId}`}
              >
                <a>招待リンク確認</a>
              </Link>
            )}
            {!group.invitationId && (
              <Link
                href="/groups/[groupId]/create-invitation"
                as={`/groups/${group.id}/create-invitation`}
              >
                <a>招待リンク作成</a>
              </Link>
            )}
          </Row>
        </Layout>
      )}
    </React.Fragment>
  );
};

export default GroupSettingsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { groupId } = context.query;
  if (groupId == null || Array.isArray(groupId)) {
    return { props: { errors: "Invalid URL" } };
  } else {
    try {
      const group = await loadGroup(groupId);
      if (group == null || group.members == null) {
        return { props: { errors: "Invalid URL" } };
      } else {
        return { props: { group } };
      }
    } catch {
      console.error("Unexpected Error");
      return { props: { errors: "Unexpected Error" } };
    }
  }
};
