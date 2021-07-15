import { Row } from "react-bootstrap";
import { Layout } from "./Layout";
import { MyHead } from "./MyHead";

export const LoaingPage = (): JSX.Element => {
  return (
    <Layout footerHide>
      <MyHead title="ローディング中" />
      <Row className="justify-content-center" />
    </Layout>
  );
};
