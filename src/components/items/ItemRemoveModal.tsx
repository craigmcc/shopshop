"use client";
// @/components/items/ItemRemoveModal.tsx

/**
 * Remove an existing Item.
 *
 * Required ModalData:
 * - item                               Item to be removed
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useRouter } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import * as ItemActions from "@/actions/ItemActions";
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

export const ItemRemoveModal = () => {
  const router = useRouter();
  const { data, isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === ModalType.ITEM_REMOVE;
  const { item } = data;
  if (!item) {
    return null;
  }

  logger.info({
    context: "ItemRemoveModal",
    data: data,
    isModalOpen: isModalOpen,
    type: type,
  });

  const onRemove = async () => {
    try {
      logger.info({
        context: "ItemRemoveModal.onRemove",
        item: item,
      });
      await ItemActions.remove(item.id);
      router.refresh();
    } catch (error) {
      // TODO - error handling
      console.log(error);
    } finally {
      onClose();
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
            Remove Item
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 px-6">
          <p>
            Do you really want to remove Item &nbsp;
            <span className="font-bold">{item.name}</span>?
          </p>
        </div>
        <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-gray-600">
          <Button variant="destructive" onClick={onRemove}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
