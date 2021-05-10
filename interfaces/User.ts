import { db } from "../utils/firebase";
import { deleteGroup, GroupWithId, loadGroup } from "./Group";

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
  user: UserWithId,
  name?: string,
  email?: string,
  description?: string
): Promise<void> => {
  const updateUser = {
    name: name ? name : user.name,
    email: email ? email : user.email,
    description: description ? description : user.description,
  };
  const updates = {
    [`/users/${user.id}`]: updateUser,
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

export const deleteUser = async (
  user: UserWithId
): Promise<(void | void[])[]> => {
  const groupList: GroupWithId[] = [];
  if (user.groups != null) {
    const groupIds = Object.keys(user.groups);
    const groups = await Promise.all(
      groupIds.map((groupId) => loadGroup(groupId))
    );
    for (const group of groups) {
      if (group != null) {
        groupList.push(group);
      }
    }
  }
  const PromiseList = groupList.map((group) => leaveGroup(user.id, group));
  PromiseList.push(db.ref(`/users/${user.id}`).remove());
  return await Promise.all(PromiseList);
};
