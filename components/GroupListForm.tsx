import { GroupWithId } from "interfaces/Group";
import { UserWithId } from "interfaces/User";
import { Table } from "react-bootstrap";
import { GroupListItem } from "./GrupListItem";

interface GroupListFormProps {
  user: UserWithId;
  groups: GroupWithId[];
  setGroups: (groups: GroupWithId[]) => void;
}

export const GroupListForm = ({
  user,
  groups,
  setGroups,
}: GroupListFormProps): JSX.Element => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>グループ名</th>
          <th>あなたのチャットID</th>
          <th>グループを退会する</th>
        </tr>
      </thead>
      <tbody>
        {groups.map((group, index) => (
          <GroupListItem
            key={index}
            group={group}
            user={user}
            groups={groups}
            setGroups={setGroups}
          />
        ))}
      </tbody>
    </Table>
  );
};
