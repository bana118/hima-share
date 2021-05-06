import { db } from "../utils/firebase";
import { joinGroup } from "./User";
import firebase from "firebase/app";

export interface Group {
  name: string;
  members?: {
    [uid: string]: true;
  };
  invitationId?: string;
}

type GroupChild =
  | string
  | {
      [uid: string]: true;
    };

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
