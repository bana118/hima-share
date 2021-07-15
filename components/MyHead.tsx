import Head from "next/head";

type MyHeadProps = {
  title?: string;
};

export const MyHead = ({
  title = "Default Title",
}: MyHeadProps): JSX.Element => {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
};
