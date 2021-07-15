import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getProviderUserData } from "utils/auth-provider";
import firebase from "firebase/app";

type InputsType = {
  password: string;
  confirmPassword: string;
};

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "パスワードは8文字以上に設定してください")
    .max(100, "パスワードは100文字までです")
    .matches(/[0-9]/, "パスワードは1文字以上の数字を含む必要があります")
    .matches(/[a-z]/, "パスワードは1文字以上の英小文字を含む必要があります")
    .matches(/[A-Z]/, "パスワードは1文字以上の英大文字を含む必要があります")
    .required("パスワードは必須です"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "パスワードが一致しません")
    .required("パスワードは必須です"),
});

type UpdatePasswordFormProps = {
  authUser: firebase.User;
  onUpdated?: () => void;
};

export const UpdatePasswordForm = ({
  authUser,
  onUpdated,
}: UpdatePasswordFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<InputsType>({ resolver: yupResolver(schema) });
  const setUnexpectedError = () => {
    setError("password", {
      type: "manual",
      message: "予期せぬエラーが発生しました！ もう一度お試しください",
    });
  };
  const updatePassword = async (data: InputsType) => {
    const passwordUserData = getProviderUserData(authUser, "password");
    if (passwordUserData == null) {
      // パスワードの追加
      if (authUser.email == null) {
        setUnexpectedError();
        return;
      }
      const credential = firebase.auth.EmailAuthProvider.credential(
        authUser.email,
        data["password"]
      );
      authUser
        .linkWithCredential(credential)
        .then(() => {
          if (onUpdated != null) {
            onUpdated();
          }
        })
        .catch((error) => {
          console.error(error);
          setUnexpectedError();
        });
    } else {
      // パスワードの更新
      authUser
        .updatePassword(data["password"])
        .then(() => {
          if (onUpdated != null) {
            onUpdated();
          }
        })
        .catch(() => {
          setUnexpectedError();
        });
    }
  };
  return (
    <Form onSubmit={handleSubmit(updatePassword)}>
      <Form.Group>
        <Form.Label>新しいパスワード</Form.Label>
        <Form.Control
          type="password"
          isInvalid={!!errors.password}
          {...register("password")}
        />
        <Form.Text className="text-muted">
          パスワードの要件 1: 8文字以上, 2: 数字を含む, 3: 英大文字を含む, 4:
          英小文字を含む
        </Form.Text>
        {errors.password && (
          <Form.Control.Feedback type="invalid">
            {errors.password.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group>
        <Form.Label>新しいパスワードの確認</Form.Label>
        <Form.Control
          type="password"
          isInvalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Button variant="accent" type="submit">
        更新
      </Button>
    </Form>
  );
};
