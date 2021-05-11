import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "../utils/firebase";
import { storeUser, User } from "../interfaces/User";
import firebase from "firebase/app";

interface RegisterFormProps {
  onRegistered?: () => void;
}

interface InputsType {
  email: string;
  name: string;
  description: string;
  password: string;
  confirmPassword: string;
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
  name: yup.string().required("名前は必須です"),
  description: yup.string(),
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

export const RegisterForm = ({
  onRegistered,
}: RegisterFormProps): JSX.Element => {
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
  const registerUser = async (data: InputsType) => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        data["email"],
        data["password"]
      );
      const authUser = userCredential.user;
      if (authUser == null) {
        setUnexpectedError();
        return;
      }
      Promise.all([]);
      const user: User = {
        name: data["name"],
        email: data["email"],
        description: data["description"],
      };
      await Promise.all([
        storeUser(user, authUser.uid),
        authUser.updateProfile({
          displayName: data["name"],
        }),
        authUser.sendEmailVerification({
          url: `${document.location.origin}`,
        }),
      ]);
      if (onRegistered != null) {
        onRegistered();
      }
    } catch {
      setUnexpectedError();
    }
  };
  return (
    <Form onSubmit={handleSubmit(registerUser)}>
      <Form.Group>
        <Form.Label>メールアドレス</Form.Label>
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
        <Form.Label>ユーザー名</Form.Label>
        <Form.Control isInvalid={!!errors.name} {...register("name")} />
        {errors.name && (
          <Form.Control.Feedback type="invalid">
            {errors.name.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group>
        <Form.Label>プロフィール</Form.Label>
        <Form.Control
          isInvalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <Form.Control.Feedback type="invalid">
            {errors.description.message}
          </Form.Control.Feedback>
        )}
        <Form.Text className="text-muted">
          簡単な自己紹介，空いている時間帯など
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>パスワード</Form.Label>
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
        <Form.Label>パスワード確認</Form.Label>
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
        登録
      </Button>
    </Form>
  );
};
