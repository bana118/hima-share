import { Layout } from "./Layout";
import { MyHead } from "./MyHead";

type ErrorPageProps = {
  errorMessage?: string;
};

export const ErrorPage = ({
  errorMessage = "Unexpected Error",
}: ErrorPageProps): JSX.Element => {
  return (
    <Layout>
      <MyHead title="エラー" />
      <p>
        <span style={{ color: "red" }}>Error:</span> {errorMessage}
      </p>
    </Layout>
  );
};
