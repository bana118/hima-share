import { useForm } from "react-hook-form";
import { Form, Button, Overlay, Tooltip } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "context/AuthContext";
import { GroupWithId, updateGroup } from "interfaces/Group";

interface UpdateGroupFormProps {
  group: GroupWithId;
  defaultValues: InputsType;
}

interface InputsType {
  name: string;
  description: string;
}

const schema = yup.object().shape({
  name: yup.string().max(20, "名前は20文字までです").required("名前は必須です"),
  description: yup.string().max(100, "説明は100文字までです"),
});

export const UpdateGroupForm = ({
  group,
  defaultValues,
}: UpdateGroupFormProps): JSX.Element => {
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
      updateGroup(group, data["name"], data["description"])
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
        <Form.Label>グループ名</Form.Label>
        <Form.Control isInvalid={!!errors.name} {...register("name")} />
        {errors.name && (
          <Form.Control.Feedback type="invalid">
            {errors.name.message}
          </Form.Control.Feedback>
        )}
        <Form.Text className="text-muted">最大20文字</Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>グループの説明</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          isInvalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <Form.Control.Feedback type="invalid">
            {errors.description.message}
          </Form.Control.Feedback>
        )}
        <Form.Text className="text-muted">
          グループの概要，使用するチャットツールなど 最大100文字
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
          <Tooltip id="update-group-tooltip" {...props}>
            更新しました！
          </Tooltip>
        )}
      </Overlay>
    </Form>
  );
};
