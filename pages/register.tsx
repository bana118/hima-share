import Link from "next/link";
import { useState } from "react";
import Layout from "../components/Layout";
import { db } from "../utils/firebase";
import { userConverter } from "../interfaces/index";

const RegisterUserPage = (): JSX.Element => {
  const [inputName, setInputName] = useState("");
  const registerUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // don't redirect the page
    await db.collection("users").withConverter(userConverter).add({
      name: inputName,
    });
    setInputName("");
  };
  return (
    <Layout title="Register User | Next.js + TypeScript Example">
      <h1>Register User</h1>
      <p>Firebase examle</p>
      <form onSubmit={registerUser}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={inputName}
          onChange={(event) => setInputName(event.target.value)}
          autoComplete="name"
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        <Link href="/">
          <a>Go home</a>
        </Link>
      </p>
    </Layout>
  );
};

export default RegisterUserPage;
