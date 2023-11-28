"use client";
// @/components/categories/CategoryFormModal.tsx

/**
 * Create a new Category.
 *
 * Required ModalData:
 * - profile                            Profile of current user
 * - list                               Currently selected List
 * - category                           Category (if editing) or null (if creating)
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

import * as CategoryActions from "@/actions/CategoryActions";
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

export const CategoryFormModal = () => {
  const { data, isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === ModalType.CATEGORY_FORM;
  const { category, list } = data;
  const router = useRouter();

  logger.info({
    context: "CategoryFormModal",
    data: data,
    isModalOpen: isModalOpen,
    type: type,
  });

  const formSchema = z.object({
    name: z.string().min(1, {
      message: "Category name is required",
    }),
  });

  const defaultValues = {
    name: "",
  };

  const form = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (category) {
      form.setValue("name", category.name);
    }
  }, [category, form]);

  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      logger.info({
        context: "CategoryFormModal.onSubmit",
        values: values,
      });
      if (category) {
        await CategoryActions.update(category.id, {
          ...values,
          listId: list!.id,
        });
      } else {
        await CategoryActions.insert({
          ...values,
          listId: list!.id,
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
            {category ? (
              <span>Edit Existing Category</span>
            ) : (
              <span>Create New Category</span>
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
                      Category Name:
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                        placeholder="Enter category name"
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
