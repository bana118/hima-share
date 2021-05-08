import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Router from "next/router";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Group, storeGroup } from "../interfaces/Group";

interface InputsType {
  name: string;
  description: string;
  chatId: string;
}

const schema = yup.object().shape({
  name: yup.string().required("名前は必須です"),
  description: yup.string(),
  chatId: yup.string(),
});

export const CreateGroupForm = (): JSX.Element => {
  const { authUser } = useContext(AuthContext);
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
  const createGroup = async (data: InputsType) => {
    if (authUser != null) {
      const group: Group = {
        name: data["name"],
        description: data["description"],
      };
      storeGroup(group, authUser.uid, data["chatId"])
        .then(() => {
          Router.push("/");
        })
        .catch(() => {
          setUnexpectedError();
        });
    } else {
      setUnexpectedError();
    }
  };
  return (
    <Form onSubmit={handleSubmit(createGroup)}>
      <Form.Group>
        <Form.Label>Group Name</Form.Label>
        <Form.Control isInvalid={!!errors.name} {...register("name")} />
        {errors.name && (
          <Form.Control.Feedback type="invalid">
            {errors.name.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group>
        <Form.Label>グループの概要</Form.Label>
        <Form.Control
          isInvalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <Form.Control.Feedback type="invalid">
            {errors.description.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group>
        <Form.Label>Chat ID</Form.Label>
        <Form.Control isInvalid={!!errors.chatId} {...register("chatId")} />
        {errors.chatId && (
          <Form.Control.Feedback type="invalid">
            {errors.chatId.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Button variant="accent" type="submit">
        作成
      </Button>
    </Form>
  );
};
