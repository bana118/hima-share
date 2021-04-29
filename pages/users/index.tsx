import { GetStaticProps } from "next";
import Link from "next/link";

import { User, userConverter } from "../../interfaces";
import Layout from "../../components/Layout";
import List from "../../components/List";

import { db } from "../../utils/firebase";

type Props = {
  items: User[];
};

const WithFirebaseProps = ({ items }: Props): JSX.Element => (
  <Layout title="Users List | Next.js + TypeScript Example">
    <h1>Users List</h1>
    <p>
      Example fetching data from inside <code>getStaticProps()</code>.
    </p>
    <p>You are currently on: /users</p>
    <List items={items} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  // Example for including static props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const querySnapshot = await db
    .collection("users")
    .withConverter(userConverter)
    .get();
  const items: User[] = querySnapshot.docs.map((doc) => {
    return { id: doc.data().id, name: doc.data().name };
  });
  return { props: { items } };
};

export default WithFirebaseProps;
