import Link from "next/link";
import React, { useEffect } from "react";
import { useContext } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";

const IndexPage = (): JSX.Element => {
  const authContext = useContext(AuthContext);
  const user = authContext.user;

  // デバッグ用にユーザー情報を表示
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
      {user && (
        <React.Fragment>
          <p>User info</p>
          <p>name: {user.displayName}</p>
          <p>email: {user.email}</p>
          <p>uid: {user.uid}</p>
          <p>
            <Link href="/calendar">
              <a>カレンダー</a>
            </Link>
          </p>
        </React.Fragment>
      )}
      {!user && (
        <React.Fragment>
          <p className="text-main font-weight-bold">
            You are not logged in yet
          </p>
          <p>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </p>
          <p>
            <Link href="/register">
              <a>Register</a>
            </Link>
          </p>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default IndexPage;
