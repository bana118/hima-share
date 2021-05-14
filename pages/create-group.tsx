import React, { useEffect } from "react";
import { useContext } from "react";
import { CreateGroupForm } from "../components/CreateGroupForm";
import { Layout } from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import Router from "next/router";
import { MyHead } from "components/MyHead";
import { Row } from "react-bootstrap";
import Link from "next/link";

const CreateGroupPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  useEffect(() => {
    if (authUser === null) {
      Router.push("/login");
    } else if (authUser != null && !authUser.emailVerified) {
      Router.push("/email-verify");
    }
  }, [authUser]);
  return (
    <Layout>
      {authUser && !(authUser != null && !authUser.emailVerified) && (
        <React.Fragment>
          <MyHead title="グループ作成" />
          <Row className="justify-content-center">
            <h1>グループ作成</h1>
          </Row>
          <Row className="justify-content-center">
            <CreateGroupForm />
          </Row>
          <Row className="justify-content-center">
            <Link href="/">
              <a>戻る</a>
            </Link>
          </Row>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default CreateGroupPage;
