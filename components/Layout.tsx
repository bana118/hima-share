import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { auth } from "../utils/firebase";
import { Navbar, Nav } from "react-bootstrap";
import Router from "next/router";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "Default Title" }: Props): JSX.Element => {
  const authContext = useContext(AuthContext);
  const logout = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    // auth.signOut().then(() => { Router.puth("/") }) とやると他ページの/loginへのリダイレクトが先に働いてしまう
    auth.signOut();
    Router.push("/");
  };
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>
      <header>
        <Navbar variant="dark" className="hima-share-navbar">
          <Link href="/" passHref>
            <Navbar.Brand className="mr-auto">Hima Share</Navbar.Brand>
          </Link>
          {authContext.authUser && (
            <Nav>
              <Link href="/profile" passHref>
                <Nav.Link className="mr-3" active>
                  Profile
                </Nav.Link>
              </Link>
              <Nav.Link active onClick={logout}>
                Logout
              </Nav.Link>
            </Nav>
          )}
          {authContext.authUser === null && (
            <Nav>
              <Link href="/login" passHref>
                <Nav.Link active>Login</Nav.Link>
              </Link>
            </Nav>
          )}
        </Navbar>
      </header>
      {children}
      <footer>
        <hr />
        <span>I&#39;m here to stay (Footer)</span>
      </footer>
    </div>
  );
};

export default Layout;
