import { db } from "../utils/firebase";
import { joinGroup, loadUser } from "./User";
import firebase from "firebase/app";
import { loadDateStatusList, UserDateStatusList } from "./DateStatus";

export interface Group {
  name: string;
  members?: {
    // Chat Id (eg. Slack, Discor, Twitter...)
    [uid: string]: string;
  };
  invitationId?: string;
  description: string;
}

type GroupChild =
  | string
  | {
      [uid: string]: string;
    };

export interface GroupWithId extends Group {
  id: string;
}

export const storeGroup = async (
  group: Group,
  uid: string,
  chatId: string
): Promise<void> => {
  const ref = await db.ref().child("groups").push(group);
  const groupId = ref.key;
  if (groupId == null) {
    return Promise.reject("GroupId is null");
  } else {
    return joinGroup(uid, groupId, chatId);
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

export const updateGroup = async (
  group: GroupWithId,
  name?: string,
  description?: string
): Promise<void> => {
  const newGroup = {
    name: name ? name : group.name,
    members: group.members ? group.members : null,
    invitationId: group.invitationId ? group.invitationId : null,
    description: description ? description : group.description,
  };
  const updates = {
    [`/groups/${group.id}`]: newGroup,
  };
  return await db.ref().update(updates);
};

export const deleteGroup = async (
  group: GroupWithId
): Promise<void | void[]> => {
  const invitationId = group.invitationId;
  if (invitationId == null) {
    await db.ref(`/groups/${group.id}`).remove();
  } else {
    await Promise.all([
      db.ref(`/groups/${group.id}`).remove(),
      db.ref(`/invitations/${invitationId}`).remove(),
    ]);
  }
};

export const setInvitation = async (
  groupId: string,
  invitationId: string
): Promise<string> => {
  await db.ref(`groups/${groupId}`).update({ invitationId: invitationId });
  return invitationId;
};

export const loadGroupAndGroupDateStatusList = async (
  groupId: string
): Promise<{
  group: GroupWithId;
  groupDateStatusList: UserDateStatusList[];
} | null> => {
  const group = await loadGroup(groupId);
  if (group == null || group.members == null) return null;

  const userIds = Object.keys(group.members);
  const nullableGroupDateStatusList = await Promise.all(
    userIds.map(async (userId) => {
      return {
        user: await loadUser(userId),
        dateStatusList: await loadDateStatusList(userId),
      };
    })
  );
  const groupDateStatusList: UserDateStatusList[] = [];
  for (let i = 0; i < userIds.length; i++) {
    const user = nullableGroupDateStatusList[i].user;
    const dateStatusList = nullableGroupDateStatusList[i].dateStatusList;
    if (user == null) {
      return null;
    }
    groupDateStatusList.push({
      user: user,
      dateStatusList: dateStatusList,
    });
  }

  groupDateStatusList.sort((a, b) => {
    const nameA = a.user.name.toUpperCase();
    const nameB = b.user.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  return { group, groupDateStatusList };
};

export const watchGroup = (
  groupId: string,
  eventType: firebase.database.EventType,
  onValueChanged: (
    key: string | null,
    value?: Group | null,
    childValue?: GroupChild | null
  ) => void
): void => {
  const ref = db.ref(`groups/${groupId}`);
  ref.on(eventType, (snapShot) => {
    if (eventType == "value") {
      const key = snapShot.key;
      const data = snapShot.val() as Group | null;
      onValueChanged(key, data, undefined);
    } else {
      const key = snapShot.key;
      const childData = snapShot.val() as GroupChild | null;
      onValueChanged(key, undefined, childData);
    }
  });
};

export const unWatchGroup = (groupId: string): void => {
  const ref = db.ref(`groups/${groupId}`);
  ref.off();
};
