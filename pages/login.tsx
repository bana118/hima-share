import Link from "next/link";
import Layout from "../components/Layout";
import { LoginForm } from "../components/LoginForm";

const RegisterPage = (): JSX.Element => {
  return (
    <Layout title="Login">
      <h1>Login</h1>
      <LoginForm />
      <p>
        <Link href="/register">
          <a>登録</a>
        </Link>
      </p>
    </Layout>
  );
};

export default RegisterPage;
