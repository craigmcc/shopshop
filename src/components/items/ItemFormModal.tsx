"use client";
// @/components/items/ItemFormModal.tsx

/**
 * Create a new Item.
 *
 * Required ModalData:
 * - category                           Currently selected Category
 * - item                               Item (if editing) or null (if creating)
 * - list                               Currently selected List
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ModalType, useModalStore } from "@/hooks/useModalStore";
import { logger } from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

export const ItemFormModal = () => {
  const { data, isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === ModalType.ITEM_FORM;
  const { category, item, list } = data;
  const router = useRouter();

  logger.info({
    context: "ItemFormModal",
    data: data,
    isModalOpen: isModalOpen,
    type: type,
  });

  const formSchema = z.object({
    name: z.string().min(1, {
      message: "Item name is required",
    }),
    notes: z.string().optional(),
  });

  const defaultValues = {
    name: "",
    notes: "",
  };

  const form = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (item) {
      form.setValue("name", item.name);
      form.setValue("notes", item.notes ? item.notes : "");
    }
  }, [form, item]);

  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      logger.info({
        context: "ItemFormModal.onSubmit",
        values: values,
      });
      if (item) {
        await ItemActions.update(item.id, {
          ...values,
          categoryId: category!.id,
          listId: category!.listId,
        });
      } else {
        await ItemActions.insert({
          ...values,
          categoryId: category!.id,
          listId: category!.listId,
        });
      }
      router.refresh();
    } catch (error) {
      // TODO - error handling
      console.log(error);
    } finally {
      form.reset();
      onClose();
    }
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {item ? (
              <span>Edit Existing Item</span>
            ) : (
              <span>Create New Item</span>
            )}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Item Name:
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                        placeholder="Enter item name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Item Notes:
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                        placeholder="Enter item notes (if any)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-gray-600">
              <Button variant="default" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
