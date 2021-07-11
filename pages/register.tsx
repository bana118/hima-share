import { MyHead } from "components/MyHead";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useContext } from "react";
import { Row } from "react-bootstrap";
import { Layout } from "../components/Layout";
import { RegisterForm } from "../components/RegisterForm";
import { AuthContext } from "../context/AuthContext";
import { GoogleLoginButton } from "components/GoogleLoginButton";

const RegisterPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    if (authUser != null) {
      Router.push("/");
    }
  }, [authUser]);

  return (
    <Layout>
      {authUser === null && (
        <React.Fragment>
          <MyHead title="アカウント作成" />
          <Row className="justify-content-center">
            <h1>アカウント作成</h1>
          </Row>
          <Row className="justify-content-center">
            <p>またはGoogleアカウントでログイン</p>
          </Row>
          <Row className="justify-content-center">
            <GoogleLoginButton />
          </Row>
          <Row className="justify-content-center">
            <RegisterForm onRegistered={() => Router.push("/email-verify")} />
          </Row>
          <Row className="justify-content-center">
            <p>アカウントをお持ちですか？</p>
            <Link href="/login">
              <a>ログイン</a>
            </Link>
          </Row>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default RegisterPage;
