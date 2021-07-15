import { Layout } from "../../../components/Layout";
import { ErrorPage } from "../../../components/ErrorPage";
import { loadGroup } from "../../../interfaces/Group";
import { CreateInvitationForm } from "../../../components/CreateInvitationForm";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Row } from "react-bootstrap";
import { NextSeo } from "next-seo";
import Router, { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import { useAsync } from "hooks/useAsync";
import { isQueryString } from "utils/type-guard";
import { LoaingPage } from "components/LoadingPage";

const CreateInvitationPage = (): JSX.Element => {
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

  if (group.data.invitationId != null) {
    Router.push(`/invitations/${group.data.invitationId}`);
    return <LoaingPage />;
  }

  return (
    <Layout>
      <NextSeo title="招待を作成" />
      <Row className="justify-content-center">
        <CreateInvitationForm authUser={authUser} group={group.data} />
      </Row>
      <Row className="justify-content-center">
        <Link href={`/groups/${group.data.id}`}>
          <a>戻る</a>
        </Link>
      </Row>
    </Layout>
  );
};

export default CreateInvitationPage;
