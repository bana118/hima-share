import { Row } from "react-bootstrap";
import { Layout } from "./Layout";
import { NextSeo } from "next-seo";

export const LoaingPage = (): JSX.Element => {
  return (
    <Layout footerHide>
      <NextSeo title="ローディング中" />
      <Row className="justify-content-center" />
    </Layout>
  );
};
