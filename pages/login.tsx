import { MyHead } from "components/MyHead";
import { SendResetPasswordMailForm } from "components/SendResetPasswordMailForm";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useContext, useState } from "react";
import { Row } from "react-bootstrap";
import { Layout } from "../components/Layout";
import { LoginForm } from "../components/LoginForm";
import { AuthContext } from "../context/AuthContext";
import { loginWithGoogle, storeUserfromLoginResult } from "utils/google";

const LoginPage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);

  useEffect(() => {
    const getLoginResult = async () => {
      await storeUserfromLoginResult();
      Router.push("/");
    };

    if (authUser != null) {
      getLoginResult();
    }
  }, [authUser]);

  return (
    <Layout>
      {authUser === null && (
        <React.Fragment>
          {showResetPasswordForm && (
            <React.Fragment>
              <MyHead title="パスワードをリセット" />
              <Row className="justify-content-center">
                <h1>パスワードの再設定</h1>
              </Row>
              <Row className="justify-content-center mt-2">
                <SendResetPasswordMailForm />
              </Row>
              <Row className="justify-content-center mt-2">
                <a
                  href="#"
                  onClick={() => {
                    setShowResetPasswordForm(false);
                  }}
                >
                  戻る
                </a>
              </Row>
            </React.Fragment>
          )}
          {!showResetPasswordForm && (
            <React.Fragment>
              <MyHead title="ログイン" />
              <Row className="justify-content-center">
                <h1>ログイン</h1>
              </Row>
              <Row className="justify-content-center">
                <LoginForm onLogined={() => Router.push("/")} />
              </Row>
              <Row className="justify-content-center mt-2">
                <input
                  type="image"
                  src="/btn_google_signin_light_normal_web.png"
                  alt="Login with Google"
                  onClick={loginWithGoogle}
                  onMouseOver={(event) =>
                    (event.currentTarget.src =
                      "btn_google_signin_light_focus_web.png")
                  }
                  onMouseOut={(event) =>
                    (event.currentTarget.src =
                      "btn_google_signin_light_normal_web.png")
                  }
                />
              </Row>
              <Row className="justify-content-center mt-2">
                <p>まだ登録していませんか?</p>
                <Link href="/register">
                  <a>登録</a>
                </Link>
              </Row>
              <Row className="justify-content-center mt-2">
                <p>パスワードを忘れた場合: </p>
                <a
                  href="#"
                  onClick={() => {
                    setShowResetPasswordForm(true);
                  }}
                >
                  再設定する
                </a>
              </Row>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Layout>
  );
};

export default LoginPage;
