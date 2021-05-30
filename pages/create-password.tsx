import { Layout } from "components/Layout";
import { MyHead } from "components/MyHead";
import { UpdatePasswordForm } from "components/UpdatePasswordForm";
import { AuthContext } from "context/AuthContext";
import Link from "next/link";
import Router from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { getProviderUserData } from "utils/auth-provider";
import firebase from "firebase/app";

const CreatePasswordPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [passwordUserData, setPasswordUserdata] = useState<
    firebase.UserInfo | null | undefined
  >(undefined);

  useEffect(() => {
    if (authUser === null) {
      Router.push("/login");
    } else if (authUser != null) {
      const userData = getProviderUserData(authUser, "password");
      setPasswordUserdata(userData);
      if (userData != null) {
        Router.push("/profile");
      }
    }
  }, [authUser]);

  return (
    <Layout>
      {authUser != null && passwordUserData === null && (
        <React.Fragment>
          <MyHead title="パスワード作成" />
          <Row className="justify-content-center">
            <UpdatePasswordForm onUpdated={() => Router.push("/profile")} />
          </Row>
          <Row className="justify-content-center">
            <Link href="/profile">
              <a>戻る</a>
            </Link>
          </Row>
        </React.Fragment>
      )}
    </Layout>
  );
};
export default CreatePasswordPage;
