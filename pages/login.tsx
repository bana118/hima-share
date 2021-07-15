import { NextSeo } from "next-seo";
import { SendResetPasswordMailForm } from "components/SendResetPasswordMailForm";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useContext, useState } from "react";
import { Row } from "react-bootstrap";
import { Layout } from "../components/Layout";
import { LoginForm } from "../components/LoginForm";
import { AuthContext } from "../context/AuthContext";
import { GoogleLoginButton } from "components/GoogleLoginButton";
import { LoaingPage } from "components/LoadingPage";

const LoginPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);

  useEffect(() => {
    if (authUser != null) {
      Router.push("/");
    }
  }, [authUser]);

  if (authUser !== null) {
    return <LoaingPage />;
  }

  return (
    <Layout>
      {showResetPasswordForm && (
        <React.Fragment>
          <NextSeo title="パスワードをリセット" />
          <Row className="justify-content-center">
            <h1>パスワードの再設定</h1>
          </Row>
          <Row className="justify-content-center mt-2">
            <SendResetPasswordMailForm />
          </Row>
          <Row className="justify-content-center mt-2">
            <a
              href="#"
              onClick={() => {
                setShowResetPasswordForm(false);
              }}
            >
              戻る
            </a>
          </Row>
        </React.Fragment>
      )}
      {!showResetPasswordForm && (
        <React.Fragment>
          <NextSeo title="ログイン" />
          <Row className="justify-content-center">
            <h1>ログイン</h1>
          </Row>
          <Row className="justify-content-center">
            <p>またはGoogleアカウントでログイン</p>
          </Row>
          <Row className="justify-content-center">
            <GoogleLoginButton />
          </Row>
          <Row className="justify-content-center">
            <LoginForm authUser={authUser} onLogined={() => Router.push("/")} />
          </Row>
          <Row className="justify-content-center mt-2">
            <p>まだ登録していませんか?</p>
            <Link href="/register">
              <a>登録</a>
            </Link>
          </Row>
          <Row className="justify-content-center mt-2">
            <p>パスワードを忘れた場合: </p>
            <a
              href="#"
              onClick={() => {
                setShowResetPasswordForm(true);
              }}
            >
              再設定する
            </a>
          </Row>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default LoginPage;
