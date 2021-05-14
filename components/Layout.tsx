import React, { ReactNode } from "react";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { auth } from "../utils/firebase";
import { Navbar, Nav, Container, Row, ListGroup } from "react-bootstrap";
import Router from "next/router";
import Image from "next/image";

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  const { authUser } = useContext(AuthContext);

  const logout = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    // auth.signOut().then(() => { Router.puth("/") }) とやると他ページの/loginへのリダイレクトが先に働いてしまう
    try {
      await auth.signOut();
      Router.push("/");
    } catch {
      console.error("Unexpected Error");
    }
  };
  return (
    <div>
      <header>
        <Navbar variant="dark" className="hima-share-navbar">
          <Link href="/" passHref>
            <Navbar.Brand className="mr-auto">Hima Share</Navbar.Brand>
          </Link>
          {authUser && (
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
          {authUser === null && (
            <Nav>
              <Link href="/login" passHref>
                <Nav.Link active>Login</Nav.Link>
              </Link>
            </Nav>
          )}
        </Navbar>
      </header>
      <Container>{children}</Container>
      <footer className="footer mt-auto py-3">
        <hr />
        <Container>
          <Row className="justify-content-center">
            <Link href="/">
              <a>
                <Image
                  src="/logo.png"
                  alt="Logo of Hima Share"
                  width={200}
                  height={25}
                />
              </a>
            </Link>
          </Row>
          <Row className="justify-content-center">
            <ListGroup horizontal={"md"}>
              <ListGroup.Item className="border-0">
                <Link href="/">
                  <a className="text-muted">トップページ</a>
                </Link>
              </ListGroup.Item>
              <ListGroup.Item className="border-0">
                <Link href="/privacy-policy">
                  <a className="text-muted">プライバシーポリシー</a>
                </Link>
              </ListGroup.Item>
              <ListGroup.Item className="border-0">
                <a
                  className="text-muted"
                  href="https://github.com/bana118/hima-share"
                >
                  Github
                </a>
              </ListGroup.Item>
            </ListGroup>
          </Row>
        </Container>
      </footer>
    </div>
  );
};
