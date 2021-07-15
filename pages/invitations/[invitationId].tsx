import { Layout } from "../../components/Layout";
import { ErrorPage } from "../../components/ErrorPage";
import {
  deleteInvitation,
  loadInvitationAndGroup,
} from "../../interfaces/Invitation";
import React, { useContext, useRef, useState } from "react";
import Router, { useRouter } from "next/router";
import { AuthContext } from "../../context/AuthContext";
import { Overlay, Row, Tooltip } from "react-bootstrap";
import { MyHead } from "components/MyHead";
import Link from "next/link";
import { useAsync } from "hooks/useAsync";
import { isQueryString } from "utils/type-guard";
import { LoaingPage } from "components/LoadingPage";

const InvitationPage = (): JSX.Element => {
  const router = useRouter();
  const { invitationId } = router.query;

  const { authUser } = useContext(AuthContext);

  const [showTooltip, setShowTooltop] = useState(false);
  const invitationUrlInput = useRef(null);

  const invitationAndGroup = useAsync(
    loadInvitationAndGroup,
    invitationId,
    isQueryString
  );
  if (invitationAndGroup.data === undefined || authUser === undefined) {
    return <LoaingPage />;
  }

  if (
    authUser === null ||
    invitationAndGroup.data === null ||
    invitationAndGroup.data.group.members == null ||
    !Object.keys(invitationAndGroup.data.group.members).includes(authUser.uid)
  ) {
    return <ErrorPage errorMessage={"Invalid URL"} />;
  }

  const joinUrl =
    typeof window !== "undefined"
      ? `${document.location.origin}/join/${invitationAndGroup.data.invitation.id}`
      : "";

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
    if (invitationAndGroup.data == null) {
      console.error("Unexpected Error");
      return;
    }
    event.preventDefault();
    deleteInvitation(
      invitationAndGroup.data.invitation.id,
      invitationAndGroup.data.invitation.groupId
    )
      .then(() => {
        Router.push(`/groups/${invitationAndGroup.data?.group.id}`);
      })
      .catch(() => {
        console.error("Unexpected Error");
      });
  };

  return (
    <Layout>
      <MyHead title="招待URL" />
      <Row className="justify-content-center">
        <p>招待URLは以下です(クリックでコピー)</p>
      </Row>
      <Row className="justify-content-center">
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
      </Row>
      <Row className="justify-content-center">
        <p>友達にシェアしよう!</p>
      </Row>
      <Row className="justify-content-center">
        <a href="#" onClick={invalidateInvitation}>
          招待URLを無効化
        </a>
      </Row>
      <Row className="justify-content-center">
        <Link href={`/groups/${invitationAndGroup.data.group.id}`}>
          <a>戻る</a>
        </Link>
      </Row>
    </Layout>
  );
};

export default InvitationPage;
