import { GroupWithId } from "interfaces/Group";
import Link from "next/link";
import { ListGroup } from "react-bootstrap";

type GroupListProps = {
  groups: GroupWithId[];
};

export const GroupList = ({ groups }: GroupListProps): JSX.Element => {
  const itemsComponent = groups.map((group) => (
    <ListGroup.Item key={group.id}>
      <Link href={`/groups/${group.id}`}>
        <a>{group.name}</a>
      </Link>
    </ListGroup.Item>
  ));
  return <ListGroup>{itemsComponent}</ListGroup>;
};
