"use client";

// @components/shared/BackButton.tsx

/**
 * Button to return to the specified page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { useCurrentListContext } from "@/contexts/CurrentListContext";
import { logger } from "@/lib/ClientLogger";
//import { setCurrentList } from "@/lib/CurrentListManager";

// Public Objects ------------------------------------------------------------

type Props = {
  // Optional CSS class(es) for additional styling
  className?: string;
  // URL of the page to return to
  href: string;
}

export function BackButton({ className, href }: Props) {

  const { setCurrentList } = useCurrentListContext();
  const router = useRouter();

  const handleClick = () => {
    logger.trace({
      context: "BackButton.handleClick",
      href: href,
    });
    if (href === "/lists") {
      logger.info({
        context: "BackButton.resettingCurrentList",
      });
      setCurrentList(null);
    }
    router.push(href);
  }

  return (
    <button
      className={`btn btn-secondary ${className}`}
      onClick={handleClick}
    >
      <ArrowLeft className="icon" />
      Back
    </button>
  )

}
