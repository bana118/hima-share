import { useForm } from "react-hook-form";
import { Form, Button, Overlay, Tooltip } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "../utils/firebase";
import { useRef, useState } from "react";

interface InputsType {
  email: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("メールアドレスの形式に誤りがあります")
    .max(100, "メールアドレスは100文字までです")
    .required("メールアドレスは必須です"),
});

export const SendResetPasswordMailForm = (): JSX.Element => {
  const buttonRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
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

  const sendResetMail = async (data: InputsType) => {
    try {
      await auth.sendPasswordResetEmail(data["email"]);
      setShowTooltip(true);
    } catch {
      setUnexpectedError();
    }
  };
  // TODO エラーメッセージがなぜかでない？
  return (
    <Form onSubmit={handleSubmit(sendResetMail)}>
      <Form.Group>
        <Form.Label>あなたのメールアドレス</Form.Label>
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
      <Button
        ref={buttonRef}
        variant="accent"
        type="submit"
        onBlur={() => {
          setShowTooltip(false);
        }}
      >
        送信
      </Button>
      <Overlay target={buttonRef.current} show={showTooltip} placement="top">
        {(props) => (
          <Tooltip id="send-mail-tooltip" {...props}>
            送信しました！
          </Tooltip>
        )}
      </Overlay>
    </Form>
  );
};
