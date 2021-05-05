import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { auth } from "../utils/firebase";

type InputsType = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onLogined?: () => void;
};

export const LoginForm = ({ onLogined }: LoginFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<InputsType>();
  const login = (data: InputsType) => {
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
  return (
    <Form onSubmit={handleSubmit(login)}>
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
