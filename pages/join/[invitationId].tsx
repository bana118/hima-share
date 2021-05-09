import { GetServerSideProps } from "next";
import { ErrorPage } from "../../components/ErrorPage";
import { loadInvitation } from "../../interfaces/Invitation";
import { GroupWithId, loadGroup } from "../../interfaces/Group";
import React from "react";
import { JoinGroupForm } from "../../components/JoinGroupForm";
import Layout from "components/Layout";
import { Row } from "react-bootstrap";

type Props = {
  group?: GroupWithId;
  errors?: string;
};

const JoinGroupPage = ({ group, errors }: Props): JSX.Element => {
  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  if (!group) {
    return <ErrorPage />;
  }

  return (
    <Layout title={`${group.name}に参加`}>
      <JoinGroupForm group={group} />
    </Layout>
  );
};

export default JoinGroupPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { invitationId } = context.query;
  if (invitationId == null || Array.isArray(invitationId)) {
    return { props: { errors: "Invalid URL" } };
  } else {
    const invitation = await loadInvitation(invitationId);
    if (invitation == null) {
      return { props: { errors: "Invalid URL" } };
    } else {
      const group = await loadGroup(invitation.groupId);
      if (group == null) {
        return { props: { errors: "Unexpected Error" } };
      } else {
        return { props: { group } };
      }
    }
  }
};
