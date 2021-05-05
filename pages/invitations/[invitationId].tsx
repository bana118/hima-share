import Link from "next/link";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { ErrorPage } from "../../components/ErrorPage";
import { InvitationWithId, loadInvitation } from "../../interfaces/Invitation";

type Props = {
  item?: InvitationWithId;
  errors?: string;
};

const CreateInvitationPage = ({ item, errors }: Props): JSX.Element => {
  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  if (!item) {
    return <ErrorPage />;
  }
  console.log(item);
  const joinUrl = `${document.location.origin}/join/${item.id}`;
  const copyURL = () => {
    const joinUrlElement = document.getElementById(
      "hima-share-join-url"
    ) as HTMLInputElement;
    if (joinUrlElement != null) {
      joinUrlElement.select();
      document.execCommand("copy");
    }
  };
  return (
    <Layout title="招待URL">
      <p>招待URLは以下です(クリックでコピー)</p>
      <input
        type="text"
        id="hima-share-join-url"
        className="form-control"
        onClick={copyURL}
        value={joinUrl}
        readOnly
      />
      <p>友達にシェアしよう!</p>
      <Link href="/">
        <a>戻る</a>
      </Link>
    </Layout>
  );
};

export default CreateInvitationPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { invitationId } = context.query;
  if (invitationId == null || Array.isArray(invitationId)) {
    return { props: { errors: "Invalid URL" } };
  } else {
    const item = await loadInvitation(invitationId);
    if (item == null) {
      return { props: { errors: "Invalid URL" } };
    } else {
      return { props: { item } };
    }
  }
};
