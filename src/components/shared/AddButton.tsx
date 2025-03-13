"use client";

// @components/shared/AddButton.tsx

/**
 * Button to add a new object.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { logger } from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  // Optional CSS class(es) for additional styling
  className?: string;
  // URL of the page to navigate to
  href: string;
}

export function AddButton({ className, href }: Props) {

  const router = useRouter();

  const handleClick = () => {
    logger.trace({
      context: "AddButton.handleClick",
      href: href,
    });
    router.push(href);
  }

  return (
    <button
      className={`btn btn-accent ${className}`}
      onClick={handleClick}
    >
      <Plus className="icon" />
      Add
    </button>
  )

}
