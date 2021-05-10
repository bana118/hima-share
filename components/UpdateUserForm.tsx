import { useForm } from "react-hook-form";
import { Form, Button, Overlay, Tooltip } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateUser, UserWithId } from "interfaces/User";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "context/AuthContext";
interface UpdateUserFormProps {
  user: UserWithId;
  defaultValues: InputsType;
}

interface InputsType {
  name: string;
  description: string;
}

const schema = yup.object().shape({
  name: yup.string().required("名前は必須です"),
  description: yup.string(),
});

export const UpdateUserForm = ({
  user,
  defaultValues,
}: UpdateUserFormProps): JSX.Element => {
  const { authUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<InputsType>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });
  const setUnexpectedError = () => {
    setError("name", {
      type: "manual",
      message: "予期せぬエラーが発生しました！ もう一度お試しください",
    });
  };

  const updateButtonRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const onSubmit = async (data: InputsType) => {
    if (authUser == null) {
      setUnexpectedError();
    } else {
      updateUser(user.id, data["name"], undefined, data["description"])
        .then(() => {
          setShowTooltip(true);
        })
        .catch(() => {
          setUnexpectedError();
        });
    }
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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

      <Button
        ref={updateButtonRef}
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
          <Tooltip id="update-user-tooltip" {...props}>
            更新しました！
          </Tooltip>
        )}
      </Overlay>
    </Form>
  );
};