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
import { findProfile } from "@/lib/ProfileHelpers";

// Public Objects ------------------------------------------------------------

export default async function ProfilePage() {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    redirect("/auth/signIn");
  }

  return (
    <div className="flex flex-col justify-center text-center max-w-5xl mx-auto gap-6">
      <ProfileSettingsForm profile={profile} />
    </div>
  );
}
