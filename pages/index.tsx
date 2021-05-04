import Link from "next/link";
import React from "react";
import { useContext } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { DateStatus, setDateStatusList } from "../interfaces/DateStatus";

const IndexPage = (): JSX.Element => {
  const authContext = useContext(AuthContext);
  const user = authContext.user;
  if (user != null) {
    const now = new Date();
    const testDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    );
    const testDateStatus: DateStatus = {
      date: testDate,
      status: "calendar-free",
    };
    setDateStatusList([testDateStatus], user.uid);
  }
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
      {user && (
        <React.Fragment>
          <p>User info</p>
          <p>name: {user.displayName}</p>
          <p>email: {user.email}</p>
          <p>uid: {user.uid}</p>
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
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
    </Layout>
  );
};

export default IndexPage;
