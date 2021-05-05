import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Router from "next/router";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Group, storeGroup } from "../interfaces/Group";

type InputsType = {
  name: string;
};

const schema = yup.object().shape({
  name: yup.string().required("名前は必須です"),
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
      };
      storeGroup(group, authUser.uid)
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
        <Form.Control
          type="name"
          isInvalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <Form.Control.Feedback type="invalid">
            {errors.name.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Button variant="accent" type="submit">
        作成
      </Button>
    </Form>
  );
};
