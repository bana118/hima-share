import { db } from "../utils/firebase";
import { joinGroup } from "./User";

export interface Group {
  name: string;
  members: {
    [uid: string]: true;
  };
}

export const storeGroup = (group: Group, uid: string): Promise<void> => {
  const groupId = db.ref().child("groups").push(group).key;
  if (groupId == null) {
    return Promise.reject("GroupId is null");
  } else {
    return joinGroup(uid, groupId);
  }
};
