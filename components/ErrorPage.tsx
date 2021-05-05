import Layout from "./Layout";

type Props = {
  errorMessage?: string;
};

export const ErrorPage = ({
  errorMessage = "Unexpected Error",
}: Props): JSX.Element => {
  return (
    <Layout title="Error Page">
      <p>
        <span style={{ color: "red" }}>Error:</span> {errorMessage}
      </p>
    </Layout>
  );
};
