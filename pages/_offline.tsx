import { Layout } from "components/Layout";
import { NextSeo } from "next-seo";
import Link from "next/link";

const OfflinePage = (): JSX.Element => {
  return (
    <Layout>
      <NextSeo title="オフラインページ" />
      <h1>オフラインページ</h1>
      <p>
        インターネットに接続していません。安定した通信環境でアプリを起動してください。
      </p>
      <Link href="/">トップページ</Link>
    </Layout>
  );
};

export default OfflinePage;
