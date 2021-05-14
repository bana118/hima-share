import Head from "next/head";

interface MyHeadProps {
  title?: string;
}

export const MyHead = ({
  title = "Default Title",
}: MyHeadProps): JSX.Element => {
  const url = typeof window !== "undefined" ? document.location.href : "";
  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={url} />
    </Head>
  );
};
