import { Layout } from "components/Layout";
import { NextSeo } from "next-seo";
import Link from "next/link";

const ServerErrorPage = (): JSX.Element => {
  return (
    <Layout>
      <NextSeo title="サーバーエラー" />
      <h1>500 - Server Error</h1>
      <p>サーバーエラーが発生しました。もう一度お試しください。</p>
      <Link href="/">トップページ</Link>
    </Layout>
  );
};

export default ServerErrorPage;
