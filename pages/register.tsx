import Link from "next/link";
import Router from "next/router";
import Layout from "../components/Layout";
import { RegisterForm } from "../components/RegisterForm";

const RegisterPage = (): JSX.Element => {
  return (
    <Layout title="Register">
      <h1>Register</h1>
      <RegisterForm onRegistered={() => Router.push("/calendar")} />
      <p>
        <Link href="/login">
          <a>ログイン</a>
        </Link>
      </p>
    </Layout>
  );
};

export default RegisterPage;
