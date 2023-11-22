"use client";
// @/components/lists/ListInviteModal.tsx

/**
 * Instructions to invite an existing user to become a member
 * of this List.
 *
 * Required ModalData:
 * - list                               List to which user is being invited
 * - profile                            Profile of signed in user
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useState } from "react";

// Internal Modules ----------------------------------------------------------

import { Icons } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalType, useModalStore } from "@/hooks/useModalStore";
import { useOrigin } from "@/hooks/useOrigin";

// Public Objects ------------------------------------------------------------

export const ListInviteModal = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const { data, isOpen, onClose, onOpen, type } = useModalStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isModalOpen = isOpen && type === ModalType.LIST_INVITE;
  const { list } = data;
  const origin = useOrigin();
  const inviteURL = `${origin}/invite/${list?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteURL);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Invite Friends
          </DialogTitle>
          <DialogDescription className="text-center text-xs">
            Ask your friends to sign in, and enter this URL in the Location Bar.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
            List Invite URL
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              disabled={isLoading}
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteURL}
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {copied ? (
                <Icons.Check className="h-4 w-4" />
              ) : (
                <Icons.Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
