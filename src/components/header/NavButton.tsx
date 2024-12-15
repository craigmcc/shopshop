// @/components/NavButton.tsx

import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type Props = {
  icon: LucideIcon,
  label: string,
  href?: string,
}

export function NavButton({
  icon: Icon,
  label,
  href,
}: Props) {

  return (
    <Button
      aria-label={label}
      asChild
      className="rounded-full"
      size="icon"
      title={label}
      variant="ghost"
    >
      {href ? (
        <Link href={href}>
          <Icon/>
        </Link>
      ) : (
        <Icon/>
      )}
    </Button>
  )
}
