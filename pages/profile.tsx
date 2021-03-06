import { DeleteUserButton } from "components/DeleteUserButton";
import { GroupListForm } from "components/GroupListForm";
import { LoginForm } from "components/LoginForm";
import { UpdateEmailForm } from "components/UpdateEmailForm";
import { UpdatePasswordForm } from "components/UpdatePasswordForm";
import { UpdateUserForm } from "components/UpdateUserForm";
import Router from "next/router";
import Link from "next/link";
import React, { useEffect, useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Layout } from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { GroupWithId } from "../interfaces/Group";
import { loadUserAndGroups } from "../interfaces/User";
import { NextSeo } from "next-seo";
import firebase from "firebase/app";
import {
  getProviderUserData,
  linkWithGoogle,
  loginWithGoogle,
} from "utils/auth-provider";
import { useAsync } from "hooks/useAsync";
import { isUidString } from "utils/type-guard";
import { LoaingPage } from "components/LoadingPage";
import { ErrorPage } from "components/ErrorPage";

const ProfilePage = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);

  const userAndGroups = useAsync(loadUserAndGroups, authUser?.uid, isUidString);

  const [groups, setGroups] = useState<GroupWithId[] | null | undefined>(
    undefined
  );

  const [onLoginedAction, setOnLoginedAction] = useState<
    | "updateEmail"
    | "updatePassword"
    | "deleteUser"
    | "linkWithGoogle"
    | undefined
  >(undefined);
  const [readyUpdateEmail, setReadyUpdateEmail] = useState(false);
  const [readyUpdatePassword, setReadyUpdatePassword] = useState(false);
  const [readyDeleteUser, setReadyDeleteUser] = useState(false);
  const [updated, setUpdated] = useState<
    "updateEmail" | "updatePassword" | undefined
  >(undefined);
  const [passwordUserData, setPasswordUserData] = useState<
    firebase.UserInfo | undefined | null
  >(undefined);
  const [googleUserData, setGoogleUserData] = useState<
    firebase.UserInfo | undefined | null
  >(undefined);

  useEffect(() => {
    if (authUser === null) {
      Router.push("/login");
    } else if (authUser != null) {
      setPasswordUserData(getProviderUserData(authUser, "password"));
      setGoogleUserData(getProviderUserData(authUser, "google.com"));
    }
  }, [authUser]);

  useEffect(() => {
    if (userAndGroups.data === undefined) {
      setGroups(undefined);
    } else if (userAndGroups.data === null) {
      setGroups(null);
    } else {
      setGroups(userAndGroups.data.groups);
    }
  }, [userAndGroups.data]);

  if (
    authUser == null ||
    userAndGroups.data === undefined ||
    groups === undefined
  ) {
    return <LoaingPage />;
  }

  if (userAndGroups.data === null || groups === null) {
    return <ErrorPage />;
  }

  return (
    <Layout>
      {updated && (
        <React.Fragment>
          <NextSeo title="????????????" />
          <Row className="justify-content-center">
            <h2>
              {updated == "updateEmail" && "??????????????????????????????????????????"}
              {updated == "updatePassword" && "????????????????????????????????????"}
            </h2>
            {updated == "updateEmail" && (
              <h3>????????????????????????????????????????????????????????????</h3>
            )}
          </Row>
          <Row className="justify-content-center">
            <Button
              variant="accent"
              type="button"
              onClick={() => {
                setUpdated(undefined);
                setOnLoginedAction(undefined);
              }}
            >
              ??????
            </Button>
          </Row>
        </React.Fragment>
      )}
      {readyUpdateEmail && (
        <React.Fragment>
          <NextSeo title="???????????????????????????" />
          <Row className="justify-content-center">
            <UpdateEmailForm
              authUser={authUser}
              onUpdated={() => {
                setReadyUpdateEmail(false);
                setUpdated("updateEmail");
              }}
            />
          </Row>
        </React.Fragment>
      )}
      {readyUpdatePassword && (
        <React.Fragment>
          <NextSeo title="?????????????????????" />
          <Row className="justify-content-center">
            <UpdatePasswordForm
              authUser={authUser}
              onUpdated={() => {
                setReadyUpdatePassword(false);
                setUpdated("updatePassword");
              }}
            />
          </Row>
        </React.Fragment>
      )}
      {readyDeleteUser && (
        <React.Fragment>
          <NextSeo title="??????????????????" />
          <Row className="justify-content-center">
            <h2>?????????{userAndGroups.data.user.name}????????????????????????</h2>
          </Row>
          <Row className="justify-content-center">
            <DeleteUserButton
              authUser={authUser}
              user={userAndGroups.data.user}
              onDeleted={() => {
                Router.push("/");
              }}
            />
          </Row>
          <Row className="justify-content-center mt-3">
            <a
              href="#"
              onClick={() => {
                setOnLoginedAction(undefined);
                setReadyDeleteUser(false);
              }}
            >
              ??????
            </a>
          </Row>
        </React.Fragment>
      )}
      {onLoginedAction != null &&
        !readyUpdateEmail &&
        !readyUpdatePassword &&
        !readyDeleteUser &&
        !updated && (
          <React.Fragment>
            <NextSeo title="????????????" />
            <Row className="justify-content-center">
              {passwordUserData != null && (
                <LoginForm
                  authUser={authUser}
                  onLogined={() => {
                    if (onLoginedAction == "updateEmail") {
                      setReadyUpdateEmail(true);
                    } else if (onLoginedAction == "updatePassword") {
                      setReadyUpdatePassword(true);
                    } else if (onLoginedAction == "deleteUser") {
                      setReadyDeleteUser(true);
                    } else {
                      if (authUser != null) {
                        linkWithGoogle(authUser);
                      } else {
                        Router.push("/login");
                      }
                    }
                  }}
                />
              )}
              {passwordUserData === null && (
                <React.Fragment>
                  <a
                    href="#"
                    onClick={() => {
                      window.history.replaceState(null, "", "/create-password");
                      loginWithGoogle();
                    }}
                  >
                    ????????????????????????
                  </a>
                  ???????????????
                </React.Fragment>
              )}
            </Row>
            <Row className="justify-content-center">
              <a
                href="#"
                onClick={() => {
                  setOnLoginedAction(undefined);
                }}
              >
                ??????
              </a>
            </Row>
          </React.Fragment>
        )}
      {onLoginedAction == null && (
        <React.Fragment>
          <NextSeo title={`${userAndGroups.data.user.name}?????????????????????`} />
          <Row className="justify-content-center">
            <Link href="/">
              <a>??????</a>
            </Link>
          </Row>
          <Row className="justify-content-center">
            <h2>??????????????????</h2>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <UpdateUserForm
                authUser={authUser}
                user={userAndGroups.data.user}
                defaultValues={{
                  name: userAndGroups.data.user.name,
                  description: userAndGroups.data.user.description,
                }}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <h2>??????????????????</h2>
          </Row>
          <Row>
            <GroupListForm
              user={userAndGroups.data.user}
              groups={groups}
              setGroups={(g: GroupWithId[]) => setGroups(g)}
            />
          </Row>
          <Row className="justify-content-center mt-3">
            <h2>Google???????????????</h2>
          </Row>
          {googleUserData == null && authUser.emailVerified && (
            <React.Fragment>
              <Row className="justify-content-center">
                <p>Google????????????????????????????????????????????????????????????</p>
              </Row>
              <Row className="justify-content-center">
                <Button
                  variant="accent"
                  type="button"
                  onClick={() => setOnLoginedAction("linkWithGoogle")}
                >
                  ?????????????????????
                </Button>
              </Row>
            </React.Fragment>
          )}
          {googleUserData == null && !authUser.emailVerified && (
            <Row className="justify-content-center">
              <p>
                Google?????????????????????????????????
                <Link href="/email-verify">
                  <a>??????????????????????????????</a>
                </Link>
                ???????????????
              </p>
            </Row>
          )}
          {googleUserData != null && passwordUserData != null && (
            <React.Fragment>
              <Row className="justify-content-center">
                <p>Google???????????????????????????????????????</p>
              </Row>
              <Row className="justify-content-center">
                <Button
                  variant="main"
                  type="button"
                  onClick={() => {
                    authUser
                      .unlink("google.com")
                      .then(() => {
                        Router.reload();
                      })
                      .catch(() => {
                        console.error("Unexpected Error");
                      });
                  }}
                >
                  Google????????????????????????????????????
                </Button>
              </Row>
            </React.Fragment>
          )}
          {googleUserData != null && passwordUserData == null && (
            <Row className="justify-content-center">
              <p>
                Google????????????????????????????????????????????????
                <a
                  href="#"
                  onClick={() => {
                    window.history.replaceState(null, "", "/create-password");
                    loginWithGoogle();
                  }}
                >
                  ????????????????????????
                </a>
                ???????????????
              </p>
            </Row>
          )}
          <Row className="justify-content-center mt-3">
            <h2>?????????????????????</h2>
          </Row>
          <Row className="justify-content-center">
            <p>???????????????????????????????????????????????????????????????</p>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form.Control
                value={authUser.email != null ? authUser.email : ""}
                readOnly
              />
            </Col>
          </Row>
          {!authUser.emailVerified && (
            <Row className="justify-content-center">
              <Form.Text>
                ??????????????????????????????????????????
                <Link href="/email-verify">
                  <a>??????</a>
                </Link>
                ??????????????????
              </Form.Text>
            </Row>
          )}
          <Row className="justify-content-center">
            <Button
              variant="accent"
              type="button"
              onClick={() => setOnLoginedAction("updateEmail")}
            >
              ?????????????????????
            </Button>
          </Row>
          <Row className="justify-content-center mt-3">
            <h2>???????????????</h2>
          </Row>
          <Row className="justify-content-center">
            <p>???????????????????????????????????????????????????????????????</p>
          </Row>
          <Row className="justify-content-center">
            <Button
              variant="accent"
              type="button"
              onClick={() => setOnLoginedAction("updatePassword")}
            >
              ?????????????????????
            </Button>
          </Row>
          <Row className="justify-content-center mt-3">
            <h2>?????????????????????</h2>
          </Row>
          <Row className="justify-content-center">
            <p>?????????????????????????????????????????????????????????????????????????????????</p>
          </Row>
          <Row className="justify-content-center">
            <Button
              variant="main"
              type="button"
              onClick={() => setOnLoginedAction("deleteUser")}
            >
              ?????????????????????
            </Button>
          </Row>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default ProfilePage;
