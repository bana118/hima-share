import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "../utils/firebase";
import firebase from "firebase/app";

type InputsType = {
  email: string;
  password: string;
  confirmPassword: string;
};

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
        }
      }
    ),
  password: yup
    .string()
    .min(8, "パスワードは8文字以上に設定してください")
    .matches(/[0-9]/, "パスワードは1文字以上の数字を含む必要があります")
    .matches(/[a-z]/, "パスワードは1文字以上の英小文字を含む必要があります")
    .matches(/[A-Z]/, "パスワードは1文字以上の英大文字を含む必要があります")
    .required("パスワードは必須です"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "パスワードが一致しません")
    .required("パスワードは必須です"),
});

export const RegisterForm = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputsType>({ resolver: yupResolver(schema) });
  const registerUser = async (data: InputsType) => {
    await auth.createUserWithEmailAndPassword(data["email"], data["password"]);
  };
  return (
    <Form onSubmit={handleSubmit(registerUser)}>
      <Form.Group>
        <Form.Label>Email address</Form.Label>
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

      <Form.Group>
        <Form.Label>Password</Form.Label>
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
        <Form.Label>Confirm password</Form.Label>
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

      <Button variant="primary" type="submit">
        登録
      </Button>
    </Form>
  );
};