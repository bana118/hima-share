import Link from "next/link";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { ErrorPage } from "../../components/ErrorPage";
import { GroupWithId, loadGroup } from "../../interfaces/Group";
import { CreateInvitationForm } from "../../components/CreateInvitationForm";

type Props = {
  item?: GroupWithId;
  errors?: string;
};

const CreateInvitationPage = ({ item, errors }: Props): JSX.Element => {
  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  if (!item) {
    return <ErrorPage />;
  }

  return (
    <Layout title="招待を作成">
      <CreateInvitationForm group={item} />
      <Link href="/">
        <a>戻る</a>
      </Link>
    </Layout>
  );
};

export default CreateInvitationPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  if (id == null || Array.isArray(id)) {
    return { props: { errors: "Invalid URL" } };
  } else {
    const item = await loadGroup(id);
    if (item == null) {
      return { props: { errors: "Invalid URL" } };
    } else {
      return { props: { item } };
    }
  }
};
