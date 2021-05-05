import Link from "next/link";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { ErrorPage } from "../../components/ErrorPage";
import {
  deleteInvitation,
  InvitationWithId,
  loadInvitation,
} from "../../interfaces/Invitation";
import React from "react";
import Router from "next/router";

type Props = {
  invitation?: InvitationWithId;
  appUrl?: string;
  errors?: string;
};

const CreateInvitationPage = ({
  invitation,
  appUrl,
  errors,
}: Props): JSX.Element => {
  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  if (!invitation || !appUrl) {
    return <ErrorPage />;
  }
  console.log(process.env);
  const joinUrl = `${appUrl}/join/${invitation.id}`;
  const copyURL = () => {
    const joinUrlElement = document.getElementById(
      "hima-share-join-url"
    ) as HTMLInputElement;
    if (joinUrlElement != null) {
      joinUrlElement.select();
      document.execCommand("copy");
    }
  };
  const invalidateInvitation = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();
    deleteInvitation(invitation.id, invitation.groupId).then(() => {
      Router.push("/");
    });
  };

  return (
    <Layout title="招待URL">
      <p>招待URLは以下です(クリックでコピー)</p>
      <input
        type="text"
        id="hima-share-join-url"
        className="form-control"
        onClick={copyURL}
        value={joinUrl}
        readOnly
      />
      <p>友達にシェアしよう!</p>
      <div>
        <a href="" onClick={invalidateInvitation}>
          招待URLを無効化
        </a>
      </div>

      <Link href="/">
        <a>戻る</a>
      </Link>
    </Layout>
  );
};

export default CreateInvitationPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { invitationId } = context.query;
  if (invitationId == null || Array.isArray(invitationId)) {
    return { props: { errors: "Invalid URL" } };
  } else {
    const invitation = await loadInvitation(invitationId);
    if (invitation == null) {
      return { props: { errors: "Invalid URL" } };
    } else {
      const appUrl = process.env.APP_URL;
      if (appUrl == null) {
        return { props: { errors: "Unexpected Error" } };
      } else {
        return { props: { invitation, appUrl } };
      }
    }
  }
};
