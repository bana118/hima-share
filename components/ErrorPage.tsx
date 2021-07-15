import { Layout } from "./Layout";
import { MyHead } from "./MyHead";
import { Row } from "react-bootstrap";

type ErrorPageProps = {
  errorMessage?: string;
};

export const ErrorPage = ({
  errorMessage = "Unexpected Error",
}: ErrorPageProps): JSX.Element => {
  return (
    <Layout>
      <MyHead title="エラー" />
      <Row className="justify-content-center mt-3">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errorMessage}
        </p>
      </Row>
    </Layout>
  );
};
