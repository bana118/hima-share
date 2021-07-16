import { Layout } from "./Layout";
import { NextSeo } from "next-seo";
import Link from "next/link";

type ErrorPageProps = {
  errorMessage?: string;
};

export const ErrorPage = ({
  errorMessage = "Unexpected Error",
}: ErrorPageProps): JSX.Element => {
  return (
    <Layout>
      <NextSeo title="エラー" />
      <h1>エラー</h1>
      <p>エラーが発生しました</p>
      <p>
        <span style={{ color: "red" }}>Error:</span> {errorMessage}
      </p>
      <Link href="/">トップページ</Link>
    </Layout>
  );
};
