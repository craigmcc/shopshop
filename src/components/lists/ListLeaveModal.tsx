"use client";
// @/components/lists/ListRemoveModal.tsx

/**
 * Leave an existing List.
 *
 * Required ModalData:
 * - list                               List to be left
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useRouter } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import * as MemberActions from "@/actions/MemberActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModalType, useModalStore } from "@/hooks/useModalStore";
import { logger } from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

export const ListLeaveModal = () => {
  const router = useRouter();
  const { data, isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === ModalType.LIST_LEAVE;
  const list = data.list;
  if (!list) {
    return null;
  }

  logger.info({
    context: "ListLeaveModal",
    data: data,
    isModalOpen: isModalOpen,
    type: type,
  });

  const onLeave = async () => {
    try {
      logger.info({
        context: "ListLeaveModal.onLeave",
        list: list,
      });
      await MemberActions.leave(list.profileId, list.id);
      router.refresh();
    } catch (error) {
      // TODO - error handling
      console.log(error);
    } finally {
      onClose();
      router.push("/");
    }
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Leave List
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 px-6">
          <p>
            Do you really want to leave list &nbsp;
            <span className="font-bold">{list!.name}</span>? You will no longer
            be able to see or update items on this list.
          </p>
        </div>
        <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-gray-600">
          <Button variant="destructive" onClick={onLeave}>
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
