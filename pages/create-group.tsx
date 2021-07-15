import React, { useEffect } from "react";
import { useContext } from "react";
import { CreateGroupForm } from "../components/CreateGroupForm";
import { Layout } from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import Router from "next/router";
import { NextSeo } from "next-seo";
import { Row } from "react-bootstrap";
import Link from "next/link";
import { LoaingPage } from "components/LoadingPage";

const CreateGroupPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    if (authUser === null) {
      Router.push("/login");
    } else if (authUser != null && !authUser.emailVerified) {
      Router.push("/email-verify");
    }
  }, [authUser]);

  if (authUser == null || (authUser != null && !authUser.emailVerified)) {
    return <LoaingPage />;
  }

  return (
    <Layout>
      <React.Fragment>
        <NextSeo title="グループ作成" />
        <Row className="justify-content-center">
          <h1>グループ作成</h1>
        </Row>
        <Row className="justify-content-center">
          <CreateGroupForm authUser={authUser} />
        </Row>
        <Row className="justify-content-center">
          <Link href="/">
            <a>戻る</a>
          </Link>
        </Row>
      </React.Fragment>
    </Layout>
  );
};

export default CreateGroupPage;
