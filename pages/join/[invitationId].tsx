import { ErrorPage } from "../../components/ErrorPage";
import { loadInvitationGroup } from "../../interfaces/Invitation";
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

  const group = useAsync(loadInvitationGroup, invitationId, isQueryString);

  if (
    group.data === undefined ||
    authUser === undefined ||
    (authUser != null && !authUser.emailVerified)
  ) {
    return <LoaingPage />;
  }

  if (group.data === null) {
    return <ErrorPage errorMessage={"Invalid URL"} />;
  }

  return (
    <Layout>
      <MyHead title={`${group.data.name}に参加`} />
      <JoinGroupForm group={group.data} />
    </Layout>
  );
};

export default JoinGroupPage;
