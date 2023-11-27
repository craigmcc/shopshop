"use client";
// @app/(auth)/signup/page.tsx

/**
 * Profile creation page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ---------------------------------------------------------

import { ModalType, useModalStore } from "@/hooks/useModalStore";

// Public Objects -----------------------------------------------------------

export default function SignUpPage() {
  const { onOpen } = useModalStore();
  onOpen(ModalType.PROFILE_SIGNUP, {});
}
