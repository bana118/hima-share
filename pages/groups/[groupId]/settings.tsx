import { Layout } from "../../../components/Layout";
import { ErrorPage } from "../../../components/ErrorPage";
import { loadGroup } from "../../../interfaces/Group";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import React from "react";
import { Row, Col } from "react-bootstrap";
import Link from "next/link";
import { UpdateGroupForm } from "components/UpdateGroupForm";
import { MyHead } from "components/MyHead";
import { LoaingPage } from "components/LoadingPage";
import { useAsync } from "hooks/useAsync";
import { isQueryString } from "utils/type-guard";
import { useRouter } from "next/router";

const GroupSettingsPage = (): JSX.Element => {
  const router = useRouter();
  const { groupId } = router.query;

  const { authUser } = useContext(AuthContext);

  const group = useAsync(loadGroup, groupId, isQueryString);

  if (group.data === undefined || authUser === undefined) {
    return <LoaingPage />;
  }

  if (
    authUser === null ||
    group.data == null ||
    group.data.members == null ||
    !Object.keys(group.data.members).includes(authUser.uid)
  ) {
    return <ErrorPage errorMessage={"Invalid URL"} />;
  }

  return (
    <Layout>
      {group && (
        <React.Fragment>
          <MyHead title="グループの設定" />
          <Row className="justify-content-center">
            <Link href={`/groups/${group.data.id}`}>
              <a>戻る</a>
            </Link>
          </Row>
          <Row className="justify-content-center">
            <h2>グループの設定</h2>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <UpdateGroupForm
                group={group.data}
                defaultValues={{
                  name: group.data.name,
                  description: group.data.description,
                }}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <h2>グループへの招待</h2>
          </Row>
          <Row className="justify-content-center">
            {group.data.invitationId && (
              <Link
                href="/invitations/[invitationId]"
                as={`/invitations/${group.data.invitationId}`}
              >
                <a>招待リンク確認</a>
              </Link>
            )}
            {!group.data.invitationId && (
              <Link
                href="/groups/[groupId]/create-invitation"
                as={`/groups/${group.data.id}/create-invitation`}
              >
                <a>招待リンク作成</a>
              </Link>
            )}
          </Row>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default GroupSettingsPage;
