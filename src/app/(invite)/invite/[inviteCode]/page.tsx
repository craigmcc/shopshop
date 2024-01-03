// @/app/(invite)/invite/[inviteCode]/page.tsx

/**
 * Destination page for fulfilling an invitation to a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { redirect } from "next/navigation";
import { MemberRole } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as ListActions from "@/actions/ListActions";
import * as MemberActions from "@/actions/MemberActions";
import { NotFound } from "@/components/shared/NotFound";
import { NotSignedIn } from "@/components/shared/NotSignedIn";
import { currentProfile } from "@/lib/currentProfile";
import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

interface InviteCodePageProps {
  params: {
    // The invite code from the incoming URL
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  logger.info({
    context: "InviteCodePage",
    inviteCode: params.inviteCode,
  });

  const profile = await currentProfile();
  if (!profile) {
    return <NotSignedIn />;
  }

  const list = await ListActions.findByInviteCode(params.inviteCode);
  if (!list) {
    return <NotFound message="Unrecognized invite code" />;
  }

  // If already a Member, just redirect to the page for this List
  const existing = await ListActions.member(profile.id, list.id);
  if (existing) {
    return redirect(`/lists/${list.id}`);
  }

  try {
    await MemberActions.insert({
      listId: list.id,
      profileId: profile.id,
      role: MemberRole.GUEST,
    });
    return redirect(`/lists/${list.id}`);
  } catch (error) {
    // TODO - error handling
    logger.error({
      context: "InviteCodePage",
      error: error,
    });
    return redirect("/");
  }
};

export default InviteCodePage;
