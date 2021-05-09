import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useContext } from "react";
import { Row } from "react-bootstrap";
import Layout from "../components/Layout";
import { LoginForm } from "../components/LoginForm";
import { AuthContext } from "../context/AuthContext";

const LoginPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  useEffect(() => {
    if (authUser !== null) {
      Router.push("/");
    }
  }, [authUser]);
  return (
    <React.Fragment>
      {authUser === null && (
        <Layout title="Login">
          <Row className="justify-content-center">
            <h1>ログイン</h1>
          </Row>
          <Row className="justify-content-center">
            <LoginForm onLogined={() => Router.push("/")} />
          </Row>
          <Row className="justify-content-center mt-2">
            <p> まだ登録していませんか?</p>
            <Link href="/register">
              <a>登録</a>
            </Link>
          </Row>
        </Layout>
      )}
    </React.Fragment>
  );
};

export default LoginPage;
