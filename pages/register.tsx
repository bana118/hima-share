import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useContext } from "react";
import Layout from "../components/Layout";
import { RegisterForm } from "../components/RegisterForm";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  useEffect(() => {
    if (authUser !== null) {
      Router.push("/");
    }
  }, [authUser]);
  return (
    <React.Fragment>
      {authUser === null && (
        <Layout title="Register">
          <h1>Register</h1>
          <RegisterForm onRegistered={() => Router.push("/calendar")} />
          <p>
            <Link href="/login">
              <a>ログイン</a>
            </Link>
          </p>
        </Layout>
      )}
    </React.Fragment>
  );
};

export default RegisterPage;
