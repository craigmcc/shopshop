"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonHTMLAttributes} from "react";

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
