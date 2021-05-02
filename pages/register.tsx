import Link from "next/link";
import Layout from "../components/Layout";
import { RegisterForm } from "../components/RegisterForm";

const LogingPage = (): JSX.Element => {
  return (
    <Layout title="Register">
      <h1>Register</h1>
      <RegisterForm />
      <p>
        <Link href="/login">
          <a>ログイン</a>
        </Link>
      </p>
    </Layout>
  );
};

export default LogingPage;
