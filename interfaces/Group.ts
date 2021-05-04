import { db } from "../utils/firebase";
import { joinGroup } from "./User";

export interface Group {
  name: string;
  members: {
    [uid: string]: true;
  };
}

export interface GroupWithId extends Group {
  id: string;
}

export const storeGroup = (group: Group, uid: string): Promise<void> => {
  const groupId = db.ref().child("groups").push(group).key;
  if (groupId == null) {
    return Promise.reject("GroupId is null");
  } else {
    return joinGroup(uid, groupId);
  }
};

export const loadGroup = (groupId: string): Promise<GroupWithId | null> => {
  const groupWithId = db
    .ref()
    .child("groups")
    .child(groupId)
    .get()
    .then((snapShot) => {
      if (snapShot.exists()) {
        const group = snapShot.val() as Group;
        return { ...group, id: groupId };
      } else {
        return null;
      }
    });

  return groupWithId;
};
