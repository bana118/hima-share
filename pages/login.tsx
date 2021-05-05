import Link from "next/link";
import Router from "next/router";
import Layout from "../components/Layout";
import { LoginForm } from "../components/LoginForm";

const LoginPage = (): JSX.Element => {
  return (
    <Layout title="Login">
      <h1>Login</h1>
      <LoginForm onLogined={() => Router.push("/")} />
      <p>
        <Link href="/register">
          <a>登録</a>
        </Link>
      </p>
    </Layout>
  );
};

export default LoginPage;
