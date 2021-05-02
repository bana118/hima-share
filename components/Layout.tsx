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
    await auth.signOut();
    Router.push("/");
  };
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <Navbar bg="light" expand="lg">
          <Link href="/" passHref>
            <Navbar.Brand>Hima Share</Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              <Link href="/about" passHref>
                <Nav.Link>About</Nav.Link>
              </Link>
            </Nav>
            {authContext.user && (
              <Nav>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </Nav>
            )}
            {!authContext.user && (
              <Nav>
                <Link href="/login" passHref>
                  <Nav.Link>Login</Nav.Link>
                </Link>
              </Nav>
            )}
          </Navbar.Collapse>
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
