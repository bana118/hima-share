import * as React from "react";

import { UserWithId } from "../interfaces";

type ListDetailProps = {
  item: UserWithId;
};

const ListDetail = ({ item: user }: ListDetailProps): JSX.Element => (
  <div>
    <h1>Detail for {user.name}</h1>
    <p>ID: {user.id}</p>
  </div>
);

export default ListDetail;
