"use client";
// @/components/categories/CategoryRemoveModal.tsx

/**
 * Remove an existing Category.
 *
 * Required ModalData:
 * - category                           Category to be removed
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useRouter } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import * as CategoryActions from "@/actions/CategoryActions";
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

export const CategoryRemoveModal = () => {
  const router = useRouter();
  const { data, isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === ModalType.CATEGORY_REMOVE;
  const { category } = data;
  if (!category) {
    return null;
  }

  logger.info({
    context: "CategoryRemoveModal",
    data: data,
    isModalOpen: isModalOpen,
    type: type,
  });

  const onRemove = async () => {
    try {
      logger.info({
        context: "CategoryRemoveModal.onRemove",
        category: category,
      });
      await CategoryActions.remove(category.id);
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
            Remove Category
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 px-6">
          <p>
            Do you really want to remove Category &nbsp;
            <span className="font-bold">{category.name}</span>? This will
            eliminate all its Items!
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
