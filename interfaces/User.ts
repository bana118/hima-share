import { db } from "../utils/firebase";
import { deleteGroup, GroupWithId, loadGroup } from "./Group";

export interface User {
  name: string;
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

export const loadUserAndGroups = async (
  uid: string
): Promise<{ user: UserWithId; groups: GroupWithId[] } | null> => {
  const user = await loadUser(uid);
  if (user == null) return null;
  const groups: GroupWithId[] = [];

  if (user.groups == null) return { user, groups };

  const groupIds = Object.keys(user.groups);
  const nullableGroups = await Promise.all(
    groupIds.map((groupId) => loadGroup(groupId))
  );
  for (const nullableGroup of nullableGroups) {
    if (nullableGroup == null) return null;
    groups.push(nullableGroup);
  }
  groups.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  return { user, groups };
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
  description?: string
): Promise<void> => {
  const newUser = {
    name: name ? name : user.name,
    groups: user.groups ? user.groups : null,
    description: description ? description : user.description,
  };
  const updates = {
    [`/users/${user.id}`]: newUser,
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
      return await Promise.all([db.ref().update(updates), deleteGroup(group)]);
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
