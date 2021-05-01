import React from "react";
import Link from "next/link";

import { UserWithId } from "../interfaces";

type Props = {
  data: UserWithId;
};

const ListItem = ({ data }: Props): JSX.Element => (
  <Link href="/users/[id]" as={`/users/${data.id}`}>
    <a>
      {data.id}: {data.name}
    </a>
  </Link>
);

export default ListItem;
