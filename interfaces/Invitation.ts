import { db } from "../utils/firebase";
import { GroupWithId, loadGroup, setInvitation } from "./Group";

export interface Invitation {
  groupId: string;
  //   limit: Date; // TODO 招待期限をつける
}

export interface InvitationWithId extends Invitation {
  id: string;
}

export const storeInvitation = async (
  invitation: Invitation,
  groupId: string
): Promise<string> => {
  // TODO setInvitationに失敗したらinvitationsへのpushを取り消す
  const ref = await db.ref().child("invitations").push(invitation);
  const invitationId = ref.key;
  if (invitationId == null) {
    return Promise.reject("InvitationId is null");
  } else {
    return setInvitation(groupId, invitationId);
  }
};

export const loadInvitation = async (
  invitationId: string
): Promise<InvitationWithId | null> => {
  const snapShot = await db
    .ref()
    .child("invitations")
    .child(invitationId)
    .once("value");
  if (snapShot.exists()) {
    const invitation = snapShot.val() as Invitation;
    return { ...invitation, id: invitationId };
  } else {
    return null;
  }
};

export const loadInvitationAndGroup = async (
  invitationId: string
): Promise<{ invitation: InvitationWithId; group: GroupWithId } | null> => {
  const invitation = await loadInvitation(invitationId);
  if (invitation == null) return null;
  const group = await loadGroup(invitation.groupId);
  if (group == null) return null;
  return { invitation, group };
};

export const deleteInvitation = async (
  invitationId: string,
  groupId: string
): Promise<void> => {
  const updates = {
    [`/invitations/${invitationId}`]: null,
    [`/groups/${groupId}/invitationId`]: null,
  };
  return db.ref().update(updates);
};
