import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type InputsType = {
  email: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email("メールアドレスの形式に誤りがあります")
    .required("メールアドレスは必須です"),
  password: yup
    .string()
    .min(8, "パスワードは8文字以上に設定してください")
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
  const registerUser = (data: InputsType) => {
    console.log(data);
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
          パスワードは8文字以上に設定してください
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
        Submit
      </Button>
    </Form>
  );
};
