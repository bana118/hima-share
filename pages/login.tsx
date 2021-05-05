import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useContext } from "react";
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
          <h1>Login</h1>
          <LoginForm onLogined={() => Router.push("/")} />
          <p>
            <Link href="/register">
              <a>登録</a>
            </Link>
          </p>
        </Layout>
      )}
    </React.Fragment>
  );
};

export default LoginPage;
