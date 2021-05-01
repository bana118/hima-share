import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { auth } from "../utils/firebase";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({
  children,
  title = "This is the default title",
}: Props): JSX.Element => {
  const authContext = useContext(AuthContext);
  const logout = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    await auth.signOut();
  };
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{" "}
          |{" "}
          <Link href="/about">
            <a>About</a>
          </Link>{" "}
          |{" "}
          {authContext.user && (
            <a href="" onClick={logout}>
              Logout
            </a>
          )}
          {!authContext.user && (
            <Link href="/login">
              <a>Login</a>
            </Link>
          )}
        </nav>
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
