import { SendResetPasswordMailForm } from "components/SendResetPasswordMailForm";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useContext, useState } from "react";
import { Row } from "react-bootstrap";
import { auth } from "utils/firebase";
import Layout from "../components/Layout";
import { LoginForm } from "../components/LoginForm";
import { AuthContext } from "../context/AuthContext";

const LoginPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  useEffect(() => {
    if (authUser != null) {
      Router.push("/");
    }
  }, [authUser]);

  return (
    <React.Fragment>
      {authUser === null && (
        <React.Fragment>
          {showResetPasswordForm && (
            <Layout title="パスワードをリセット">
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
            </Layout>
          )}
          {!showResetPasswordForm && (
            <Layout title="ログイン">
              <Row className="justify-content-center">
                <h1>ログイン</h1>
              </Row>
              <Row className="justify-content-center">
                <LoginForm onLogined={() => Router.push("/")} />
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
            </Layout>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default LoginPage;
