"use client";
// @/components/shared/ActionTooltip.tsx

/**
 * Wrap the children passed to this component with a suitably
 * configured tooltip.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

interface ActionTooltipProps {
  // Alignment of the tooltip content when displayed ["center"]
  align?: "center" | "end" | "start";
  // Children to be displayed when tooltip is opened
  children: React.ReactNode;
  // Label to be displayed when tooltip is opened
  label: string;
  // Side of the parent object to open the tooltip on ["top"]
  side?: "bottom" | "left" | "right" | "top";
}

export const ActionTooltip = ({
  align,
  children,
  label,
  side,
}: ActionTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent align={align} side={side}>
          <p className="text-sm">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
