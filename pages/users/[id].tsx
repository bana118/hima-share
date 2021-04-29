import { GetStaticProps, GetStaticPaths } from "next";

import { User, userConverter } from "../../interfaces";
import Layout from "../../components/Layout";
import ListDetail from "../../components/ListDetail";

import { db } from "../../utils/firebase";

type Props = {
  item?: User;
  errors?: string;
};

const StaticPropsDetail = ({ item, errors }: Props): JSX.Element => {
  if (errors) {
    return (
      <Layout title="Error | Next.js + TypeScript Example">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${
        item ? item.name : "User Detail"
      } | Next.js + TypeScript Example`}
    >
      {item && <ListDetail item={item} />}
    </Layout>
  );
};

export default StaticPropsDetail;

export const getStaticPaths: GetStaticPaths = async () => {
  const querySnapshot = await db
    .collection("users")
    .withConverter(userConverter)
    .get();
  const items: User[] = querySnapshot.docs.map((doc) => {
    return { id: doc.data().id, name: doc.data().name };
  });
  const paths = items.map((user) => ({
    params: { id: user.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = params?.id;
    const querySnapshot = await db
      .collection("users")
      .withConverter(userConverter)
      .get();
    const items: User[] = querySnapshot.docs.map((doc) => {
      return { id: doc.data().id, name: doc.data().name };
    });
    const item = items.find((data) => data.id === id);
    // By returning { props: item }, the StaticPropsDetail component
    // will receive `item` as a prop at build time
    return { props: { item } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
