import { Layout } from "./Layout";
import { MyHead } from "./MyHead";

type Props = {
  errorMessage?: string;
};

export const ErrorPage = ({
  errorMessage = "Unexpected Error",
}: Props): JSX.Element => {
  return (
    <Layout>
      <MyHead title="エラー" />
      <p>
        <span style={{ color: "red" }}>Error:</span> {errorMessage}
      </p>
    </Layout>
  );
};
