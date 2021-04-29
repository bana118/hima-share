import * as React from "react";
import ListItem from "./ListItem";
import { UserWithId } from "../interfaces";

type Props = {
  items: UserWithId[];
};

const List = ({ items }: Props): JSX.Element => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        <ListItem data={item} />
      </li>
    ))}
  </ul>
);

export default List;
