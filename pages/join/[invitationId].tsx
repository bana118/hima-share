import { ErrorPage } from "../../components/ErrorPage";
import { loadInvitationAndGroup } from "../../interfaces/Invitation";
import React, { useContext, useEffect } from "react";
import { JoinGroupForm } from "../../components/JoinGroupForm";
import { Layout } from "components/Layout";
import { AuthContext } from "context/AuthContext";
import Router, { useRouter } from "next/router";
import { MyHead } from "components/MyHead";
import { useAsync } from "../../hooks/useAsync";
import { LoaingPage } from "components/LoadingPage";
import { isQueryString } from "utils/query";

const JoinGroupPage = (): JSX.Element => {
  const router = useRouter();
  const { invitationId } = router.query;

  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    if (authUser != null && !authUser.emailVerified) {
      Router.push("/email-verify");
    }
  }, [authUser]);

  const invitationAndGroup = useAsync(
    loadInvitationAndGroup,
    invitationId,
    isQueryString
  );

  if (
    invitationAndGroup.data === undefined ||
    authUser === undefined ||
    (authUser != null && !authUser.emailVerified)
  ) {
    return <LoaingPage />;
  }

  if (invitationAndGroup.data === null) {
    return <ErrorPage errorMessage={"Invalid URL"} />;
  }

  return (
    <Layout>
      <MyHead title={`${invitationAndGroup.data.group.name}に参加`} />
      <JoinGroupForm group={invitationAndGroup.data.group} />
    </Layout>
  );
};

export default JoinGroupPage;
