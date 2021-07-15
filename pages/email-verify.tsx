import { Layout } from "components/Layout";
import { LoaingPage } from "components/LoadingPage";
import { MyHead } from "components/MyHead";
import { AuthContext } from "context/AuthContext";
import Link from "next/link";
import Router from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, Overlay, Row, Tooltip } from "react-bootstrap";

const EmailVerifyPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);

  const buttonRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (authUser === null) {
      Router.push("/login");
    } else if (authUser != null && authUser.emailVerified) {
      Router.push("/");
    }
  }, [authUser]);

  const sendVerifyMail = async () => {
    if (authUser != null) {
      try {
        await authUser.sendEmailVerification({
          url: `${document.location.origin}`,
        });
        setShowTooltip(true);
      } catch {
        console.error("Unexpected Error");
      }
    }
  };

  if (authUser == null) {
    return <LoaingPage />;
  }

  return (
    <Layout>
      <MyHead title="メールアドレス確認" />
      <Row className="justify-content-center">
        <h2>{authUser.email}に確認メールを送信しました</h2>
      </Row>
      <Row className="justify-content-center">
        <h3>確認メール内のリンクをクリックして下さい</h3>
      </Row>
      <Row className="justify-content-center">
        <Button
          ref={buttonRef}
          onClick={sendVerifyMail}
          onBlur={() => {
            setShowTooltip(false);
          }}
        >
          確認メールを再送する
        </Button>
        <Overlay target={buttonRef.current} show={showTooltip} placement="top">
          {(props) => (
            <Tooltip id="mail-sent-tooltip" {...props}>
              メールを送信しました！
            </Tooltip>
          )}
        </Overlay>
      </Row>
      <Row className="justify-content-center">
        <Link href="/profile">
          <a>メールアドレスを変更する</a>
        </Link>
      </Row>
    </Layout>
  );
};

export default EmailVerifyPage;
