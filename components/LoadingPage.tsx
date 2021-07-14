import { Row, Spinner } from "react-bootstrap";
import { Layout } from "./Layout";
import { MyHead } from "./MyHead";

export const LoaingPage = (): JSX.Element => {
  return (
    <Layout>
      <MyHead title="ローディング中" />
      <Row className="justify-content-center">
        <Spinner animation="border" />
      </Row>
    </Layout>
  );
};
