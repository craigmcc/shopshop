"use client"

/**
 * Generic "back" button that backtracks in the browser history.
 *
 * @packageDocumentation
 */

import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes} from "react";

import { Button } from "@/components/ui/button";

type Props = {
  className?: string,
  title: string,
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function BackButton(
  { title, variant, className, ...props }: Props
) {
  const router = useRouter();
  return (
    <Button
      className={className}
      onClick={() => router.back()}
      title={title}
      variant={variant}
      {...props}
    >
      {title}
    </Button>
  )
}
