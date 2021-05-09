import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
interface UpdateUserFormProps {
  onUpdated?: () => void;
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
  onUpdated,
}: UpdateUserFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<InputsType>({ resolver: yupResolver(schema) });
  const setUnexpectedError = () => {
    setError("name", {
      type: "manual",
      message: "予期せぬエラーが発生しました！ もう一度お試しください",
    });
  };
  const updateUser = async (data: InputsType) => {};
  return (
    <Form onSubmit={handleSubmit(updateUser)}>
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

      <Button variant="accent" type="submit">
        更新
      </Button>
    </Form>
  );
};
