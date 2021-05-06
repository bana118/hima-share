import { db } from "../utils/firebase";
import { joinGroup } from "./User";

export interface Group {
  name: string;
  members?: {
    [uid: string]: true;
  };
  invitationId?: string;
}

export interface GroupWithId extends Group {
  id: string;
}

export const storeGroup = async (group: Group, uid: string): Promise<void> => {
  const ref = await db.ref().child("groups").push(group);
  const groupId = ref.key;
  if (groupId == null) {
    return Promise.reject("GroupId is null");
  } else {
    return joinGroup(uid, groupId);
  }
};

export const loadGroup = async (
  groupId: string
): Promise<GroupWithId | null> => {
  const snapShot = await db.ref().child("groups").child(groupId).once("value");
  if (snapShot.exists()) {
    const group = snapShot.val() as Group;
    return { ...group, id: groupId };
  } else {
    return null;
  }
};

export const setInvitation = async (
  groupId: string,
  invitationId: string
): Promise<string> => {
  await db.ref(`groups/${groupId}`).update({ invitationId: invitationId });
  return invitationId;
};
