import React, { useEffect } from "react";
import { useContext } from "react";
import { CreateGroupForm } from "../components/CreateGroupForm";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import Router from "next/router";

const CreateGroupPage = (): JSX.Element => {
  const { user, isLoading } = useContext(AuthContext);
  useEffect(() => {
    if (!isLoading && user == null) {
      Router.push("/login");
    }
  }, [isLoading]);
  return (
    <React.Fragment>
      {user && (
        <Layout title="Create Group">
          <h1>Create Group</h1>
          <CreateGroupForm />
        </Layout>
      )}
    </React.Fragment>
  );
};

export default CreateGroupPage;
