import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "../utils/firebase";
import firebase from "firebase/app";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";

interface UpdateEmailFormProps {
  onUpdated?: (newEmail: string) => void;
}

interface InputsType {
  email: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("メールアドレスの形式に誤りがあります")
    .required("メールアドレスは必須です")
    .test(
      "email-test",
      "入力したメールアドレスは既に登録されています",
      async (value) => {
        if (value == null) {
          return true;
        } else {
          try {
            const providers = await auth.fetchSignInMethodsForEmail(value);
            const isAlreadyUsed =
              providers.findIndex(
                (p) =>
                  p ===
                  firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
              ) !== -1;
            if (isAlreadyUsed) {
              return false;
            } else {
              return true;
            }
          } catch {
            console.error("Unexpected Error");
            return false;
          }
        }
      }
    ),
});

export const UpdateEmailForm = ({
  onUpdated,
}: UpdateEmailFormProps): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<InputsType>({ resolver: yupResolver(schema) });
  const setUnexpectedError = () => {
    setError("email", {
      type: "manual",
      message: "予期せぬエラーが発生しました！ もう一度お試しください",
    });
  };

  const updateEmail = async (data: InputsType) => {
    if (authUser == null) {
      setUnexpectedError();
    } else {
      try {
        await authUser.updateEmail(data["email"]);
        await authUser.sendEmailVerification({
          url: `${document.location.origin}`,
        });
        if (onUpdated != null) {
          onUpdated(data["email"]);
        }
      } catch {
        setUnexpectedError();
      }
    }
  };
  // TODO エラーメッセージがなぜかでない？
  return (
    <Form onSubmit={handleSubmit(updateEmail)}>
      <Form.Group>
        <Form.Label>新しいメールアドレス</Form.Label>
        <Form.Control
          type="email"
          isInvalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <Form.Control.Feedback type="invalid">
            {errors.email.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Button variant="accent" type="submit">
        更新
      </Button>
    </Form>
  );
};
