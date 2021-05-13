import React, { useEffect } from "react";
import { useContext } from "react";
import { CreateGroupForm } from "../components/CreateGroupForm";
import { Layout } from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import Router from "next/router";

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
    <React.Fragment>
      {authUser && !(authUser != null && !authUser.emailVerified) && (
        <Layout title="Create Group">
          <h1>Create Group</h1>
          <CreateGroupForm />
        </Layout>
      )}
    </React.Fragment>
  );
};

export default CreateGroupPage;
