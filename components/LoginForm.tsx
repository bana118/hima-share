import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { auth } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Router from "next/router";

type InputsType = {
  email: string;
  password: string;
};

export const LoginForm = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<InputsType>();
  const authContext = useContext(AuthContext);
  const login = (data: InputsType) => {
    auth
      .signInWithEmailAndPassword(data["email"], data["password"])
      .then(() => {
        Router.push("/");
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

      <Button variant="primary" type="submit">
        ログイン
      </Button>
    </Form>
  );
};
