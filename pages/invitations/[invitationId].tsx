import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { ErrorPage } from "../../components/ErrorPage";
import {
  deleteInvitation,
  InvitationWithId,
  loadInvitation,
} from "../../interfaces/Invitation";
import React, { useContext, useRef, useState } from "react";
import Router from "next/router";
import { AuthContext } from "../../context/AuthContext";
import { GroupWithId, loadGroup } from "../../interfaces/Group";
import { Overlay, Tooltip } from "react-bootstrap";

type Props = {
  invitation?: InvitationWithId;
  group?: GroupWithId;
  appUrl?: string;
  errors?: string;
};

const CreateInvitationPage = ({
  invitation,
  group,
  appUrl,
  errors,
}: Props): JSX.Element => {
  const [showTooltip, setShowTooltop] = useState(false);
  const invitationUrlInput = useRef(null);

  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  if (!invitation || !group || !appUrl) {
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

  const joinUrl = `${appUrl}/join/${invitation.id}`;
  const copyURL = () => {
    const joinUrlElement = document.getElementById(
      "hima-share-join-url"
    ) as HTMLInputElement;
    if (joinUrlElement != null) {
      joinUrlElement.select();
      document.execCommand("copy");
      setShowTooltop(true);
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
        ref={invitationUrlInput}
        type="text"
        id="hima-share-join-url"
        className="form-control"
        onClick={copyURL}
        onBlur={() => {
          setShowTooltop(false);
        }}
        value={joinUrl}
        readOnly
      />
      <Overlay
        target={invitationUrlInput.current}
        show={showTooltip}
        placement="top"
      >
        {(props) => (
          <Tooltip id="copy-url-tooltip" {...props}>
            コピーしました！
          </Tooltip>
        )}
      </Overlay>
      <p>友達にシェアしよう!</p>
      <div>
        <a href="#" onClick={invalidateInvitation}>
          招待URLを無効化
        </a>
      </div>
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
      const group = await loadGroup(invitation.groupId);
      if (appUrl == null) {
        return { props: { errors: "Unexpected Error" } };
      } else {
        return { props: { invitation, group, appUrl } };
      }
    }
  }
};
