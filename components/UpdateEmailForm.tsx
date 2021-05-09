import { useForm } from "react-hook-form";
import { Form, Button, Tooltip, Overlay } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "../utils/firebase";
import firebase from "firebase/app";
import { UserWithId } from "interfaces/User";
import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "context/AuthContext";

interface UpdateEmailFormProps {
  user: UserWithId;
  email: string;
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
});

export const UpdateEmailForm = ({
  user,
  email,
}: UpdateEmailFormProps): JSX.Element => {
  const { authUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<InputsType>({
    resolver: yupResolver(schema),
    defaultValues: { email: email },
  });
  const setUnexpectedError = () => {
    setError("email", {
      type: "manual",
      message: "予期せぬエラーが発生しました！ もう一度お試しください",
    });
  };

  const updateButtonRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const updateEmail = async (data: InputsType) => {
    if (authUser == null) {
      setUnexpectedError();
    } else {
      const newUser: User = {
        name: user.name,
        email: data["email"],
        groups: user.groups,
        description: user.description,
      };
    }
  };
  return (
    <Form onSubmit={handleSubmit(updateEmail)}>
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
      <Button
        variant="accent"
        type="submit"
        onBlur={() => {
          setShowTooltip(false);
        }}
      >
        更新
      </Button>
      <Overlay
        target={updateButtonRef.current}
        show={showTooltip}
        placement="right"
      >
        {(props) => (
          <Tooltip id="update-email-tooltip" {...props}>
            更新しました！
          </Tooltip>
        )}
      </Overlay>
    </Form>
  );
};
