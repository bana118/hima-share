import Link from "next/link";
import Layout from "../components/Layout";
import { RegisterForm } from "../components/RegisterForm";

const RegisterPage = (): JSX.Element => {
  return (
    <Layout title="Register User | Next.js + TypeScript Example">
      <h1>Register User</h1>
      <p>Firebase examle</p>
      <RegisterForm />
      <p>
        <Link href="/">
          <a>Go home</a>
        </Link>
      </p>
    </Layout>
  );
};

export default RegisterPage;
