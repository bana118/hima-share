import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { auth } from "../utils/firebase";
import firebase from "firebase/app";

type InputsType = {
  email: string;
  password: string;
};

type LoginFormProps = {
  authUser: firebase.User | null;
  onLogined?: () => void;
};

export const LoginForm = ({
  authUser,
  onLogined,
}: LoginFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<InputsType>();

  const login = async (data: InputsType) => {
    auth
      .signInWithEmailAndPassword(data["email"], data["password"])
      .then(() => {
        if (onLogined != null) {
          onLogined();
        }
      })
      .catch(() => {
        const errorMessage =
          "メールアドレスが登録されていないかパスワードが間違えています";
        setError("email", {
          type: "manual",
          message: errorMessage,
        });
        setError("password", {
          type: "manual",
          message: errorMessage,
        });
      });
  };
  const updateCredential = async (data: InputsType) => {
    if (authUser != null) {
      const credential = firebase.auth.EmailAuthProvider.credential(
        data["email"],
        data["password"]
      );
      authUser
        .reauthenticateWithCredential(credential)
        .then(() => {
          if (onLogined != null) {
            onLogined();
          }
        })
        .catch((error) => {
          console.error(error);
          const errorMessage =
            "メールアドレスが登録されていないかパスワードが間違えています";
          setError("email", {
            type: "manual",
            message: errorMessage,
          });
          setError("password", {
            type: "manual",
            message: errorMessage,
          });
        });
    }
  };

  const onSubmit = async (data: InputsType) => {
    if (authUser === null) {
      try {
        await login(data);
      } catch {
        console.error("Unexpected Error");
      }
    } else {
      try {
        await updateCredential(data);
      } catch {
        console.error("Unexpected Error");
      }
    }
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
        <Form.Label>パスワード</Form.Label>
        <Form.Control
          type="password"
          isInvalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <Form.Control.Feedback type="invalid">
            {errors.password.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Button variant="accent" type="submit">
        ログイン
      </Button>
    </Form>
  );
};
