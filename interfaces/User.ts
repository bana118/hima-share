import { db } from "../utils/firebase";
import { deleteGroup, GroupWithId } from "./Group";

export interface User {
  name: string;
  email: string;
  groups?: {
    // Chat Id (eg. Slack, Discor, Twitter...)
    [groupId: string]: string | undefined;
  };
  description: string;
}

export interface UserWithId extends User {
  id: string;
}

export const storeUser = (user: User, uid: string): Promise<void> => {
  return db.ref(`users/${uid}`).set(user);
};

export const loadUser = async (uid: string): Promise<UserWithId | null> => {
  const snapShot = await db.ref().child("users").child(uid).once("value");
  if (snapShot.exists()) {
    const user = snapShot.val() as User;
    return { ...user, id: uid };
  } else {
    return null;
  }
};

export const joinGroup = async (
  uid: string,
  groupId: string,
  chatId: string
): Promise<void> => {
  const updates = {
    [`/users/${uid}/groups/${groupId}`]: chatId,
    [`/groups/${groupId}/members/${uid}`]: chatId,
  };
  return await db.ref().update(updates);
};

export const updateUser = async (
  uid: string,
  name?: string,
  email?: string,
  description?: string
): Promise<void> => {
  const updateUser = {
    name: name,
    email: email,
    description: description,
  };
  const updates = {
    [`/users/${uid}`]: updateUser,
  };
  return await db.ref().update(updates);
};

export const updateGroupChatId = async (
  uid: string,
  groupId: string,
  chatId: string
): Promise<void> => {
  const updates = {
    [`/users/${uid}/groups/${groupId}`]: chatId,
    [`/groups/${groupId}/members/${uid}`]: chatId,
  };
  return await db.ref().update(updates);
};

export const leaveGroup = async (
  uid: string,
  group: GroupWithId
): Promise<void | void[]> => {
  const updates = {
    [`/users/${uid}/groups/${group.id}`]: null,
    [`/groups/${group.id}/members/${uid}`]: null,
  };
  if (group.members != null) {
    const membersLength = Object.keys(group.members).length;
    if (membersLength == 1) {
      return await Promise.all([
        db.ref().update(updates),
        deleteGroup(group.id),
      ]);
    } else {
      return await db.ref().update(updates);
    }
  }
};
