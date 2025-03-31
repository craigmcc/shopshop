// @/app/(ss)/profile/page.tsx

/**
 * Profile update page for the currently signed in Profile.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { ProfileSettingsForm } from "@/components/profiles/ProfileSettingsForm";
import { SubHeader } from "@/components/layout/SubHeader";
import { findProfile } from "@/lib/ProfileHelpers";

// Public Objects ------------------------------------------------------------

export default async function ProfilePage() {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    redirect("/auth/signIn");
  }

  return (
    <div className="flex flex-col w-full items-center justify-center p-4">
      <SubHeader
        hrefBack="/"
        title="Edit Profile Settings"
      />
      <ProfileSettingsForm profile={profile} />
    </div>
  );
}
