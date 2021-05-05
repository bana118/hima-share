import Link from "next/link";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { ErrorPage } from "../../components/ErrorPage";
import { GroupWithId, loadGroup } from "../../interfaces/Group";
import { CreateInvitationForm } from "../../components/CreateInvitationForm";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import React from "react";

type Props = {
  group?: GroupWithId;
  errors?: string;
};

const CreateInvitationPage = ({ group, errors }: Props): JSX.Element => {
  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  if (!group) {
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

  return (
    <Layout title="招待を作成">
      <CreateInvitationForm group={group} />
      <Link href="/">
        <a>戻る</a>
      </Link>
    </Layout>
  );
};

export default CreateInvitationPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { groupId } = context.query;
  if (groupId == null || Array.isArray(groupId)) {
    return { props: { errors: "Invalid URL" } };
  } else {
    const group = await loadGroup(groupId);
    if (group == null) {
      return { props: { errors: "Invalid URL" } };
    } else {
      return { props: { group } };
    }
  }
};
