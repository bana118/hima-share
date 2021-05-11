import Layout from "components/Layout";
import { AuthContext } from "context/AuthContext";
import Link from "next/link";
import Router from "next/router";
import React, { useContext, useEffect } from "react";
import { Button, Row } from "react-bootstrap";

const EmailVerifyPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  useEffect(() => {
    if (authUser === null) {
      Router.push("/login");
    } else if (authUser != null && authUser.emailVerified) {
      Router.push("/");
    }
  }, [authUser]);
  const sendVerifyMail = () => {
    if (authUser != null) {
      try {
        authUser.sendEmailVerification({
          url: `${document.location.origin}`,
        });
      } catch {
        console.error("Unexpected Error");
      }
    }
  };
  return (
    <React.Fragment>
      {authUser != null && (
        <Layout title="メールアドレス確認">
          <Row className="justify-content-center">
            <h2>{authUser.email}に確認メールを送信しました</h2>
          </Row>
          <Row className="justify-content-center">
            <h3>確認メール内のリンクをクリックして下さい</h3>
          </Row>
          <Row className="justify-content-center">
            <Button onClick={sendVerifyMail}>確認メールを再送する</Button>
          </Row>
          <Row className="justify-content-center">
            <Link href="/profile">
              <a>メールアドレスを変更する</a>
            </Link>
          </Row>
        </Layout>
      )}
    </React.Fragment>
  );
};
export default EmailVerifyPage;
