import { MyHead } from "components/MyHead";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useContext } from "react";
import { Row } from "react-bootstrap";
import { Layout } from "../components/Layout";
import { RegisterForm } from "../components/RegisterForm";
import { AuthContext } from "../context/AuthContext";
import Image from "next/image";
import { loginWithGoogle } from "utils/google";

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
            <input
              type="image"
              src="/btn_google_signin_light_normal_web.png"
              alt="Login with Google"
              onClick={loginWithGoogle}
            />
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
