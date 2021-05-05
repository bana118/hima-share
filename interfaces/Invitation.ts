import { db } from "../utils/firebase";
import { setInvitation } from "./Group";

export interface Invitation {
  groupId: string;
  //   limit: Date; // TODO 招待期限をつける
}

export interface InvitationWithId {
  id: string;
  groupId: string;
}

export const storeInvitation = async (
  invitation: Invitation,
  groupId: string
): Promise<void> => {
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
): Promise<Invitation | null> => {
  const snapShot = await db
    .ref()
    .child("invitations")
    .child(invitationId)
    .get();
  if (snapShot.exists()) {
    const invitation = snapShot.val() as Invitation;
    return invitation;
  } else {
    return null;
  }
};
