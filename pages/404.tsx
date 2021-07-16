import { Layout } from "components/Layout";
import { NextSeo } from "next-seo";
import Link from "next/link";

const NotFoundPage = (): JSX.Element => {
  return (
    <Layout>
      <NextSeo title="ページが見つかりません" />
      <h1>404 - Not Found</h1>
      <p>ページが存在しないか、URLが間違っている可能性があります。</p>
      <Link href="/">トップページ</Link>
    </Layout>
  );
};

export default NotFoundPage;
