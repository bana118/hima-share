import { Layout } from "components/Layout";
import { MyHead } from "components/MyHead";
import Obfuscate from "react-obfuscate";

const PrivacyPolicyPage = (): JSX.Element => {
  const url = typeof window !== "undefined" ? document.location.origin : "";
  return (
    <Layout>
      <MyHead title="プライバシーポリシー" />
      <h1>プライバシーポリシー</h1>
      <p>
        「{url}
        」（以下、当サイト）を利用される方は、以下に記載する諸条件に同意したものとみなします。
      </p>
      <h2>アクセス解析ツールについて</h2>
      <p>
        当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
        このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。
        このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
        この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。
        この規約に関して、詳しくは
        <a href="https://policies.google.com/">ポリシーと規約 – Google</a>
        を参照してください。
      </p>
      <h2>免責事項</h2>
      <p>
        当サイト利用者が当サイトを閲覧し、その内容を参照した事によって何かしらの損害を被った場合でも当サイト管理者は責任を負いません。
        また、当サイトからリンクされた当サイト以外のウェブサイトの内容やサービスに関して、
        当サイトの個人情報の保護についての諸条件は適用されません。
        当サイト以外のウェブサイトの内容及び、個人情報の保護に関しても当サイト管理者は責任を負いません。
        当サイトで引用している文章や画像、楽曲について著作権は引用基にあります。
        万が一不適切な記事、画像、リンク等がありましたら早急に削除するなどの対応を致しますので、
        恐れ入りますが下記メールアドレスからご連絡くださるようよろしくお願い致します。
      </p>
      <h2>お問い合わせ</h2>
      <p>
        本ポリシーに関するお問い合せは下記までご連絡ください。
        <br />⇒<Obfuscate email="bana.titech@gmail.com" />
      </p>
    </Layout>
  );
};
export default PrivacyPolicyPage;
