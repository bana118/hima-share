import { db } from "../utils/firebase";

export interface Invitation {
  groupId: string;
  //   limit: Date; // TODO 招待期限をつける
}

export interface InvitationWithId {
  id: string;
  groupId: string;
}

export const storeInvitation = async (
  invitation: Invitation
): Promise<string | null> => {
  const ref = await db.ref().child("invitations").push(invitation);
  return ref.key;
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
