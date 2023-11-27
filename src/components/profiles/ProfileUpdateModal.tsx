"use client";
// @/components/profiles/ProfileUpdateModal.tsx

/**
 * Form for changing a Profile's settings (other than password).
 *
 * Required ModalData:
 * - profile                            Profile whose settings are to be changed
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Internal Modules ----------------------------------------------------------

import * as ProfileActions from "@/actions/ProfileActions";
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

export const ProfileUpdateModal = () => {
  const { data, isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === ModalType.PROFILE_UPDATE;
  const profile = data.profile;
  const router = useRouter();
  const { data: session, status, update } = useSession();

  logger.trace({
    context: "ProfileUpdateModal",
    isModalOpen: isModalOpen,
    type: type,
  });

  const formSchema = z.object({
    email: z
      .string()
      .email("Must be a valid email address")
      .refine(async (value) => {
        const result = await ProfileActions.email(value);
        return !result || result.id === profile!.id;
      }, "That email address is already in use"),
    name: z.string().min(1, {
      message: "User name is required",
    }),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
    },
    mode: "onBlur",
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (profile) {
      form.setValue("email", profile.email);
      form.setValue("name", profile.name);
    }
  }, [form, profile]);

  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    logger.trace({
      context: "ProfileUpdateModal.handleClose",
    });
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      logger.trace({
        context: "ProfileUpdateModal.onSubmit.request",
        email: values.email,
        name: values.name,
      });
      // Update the Profile in the database
      const result = await ProfileActions.update(profile!.id, {
        email: values.email,
        name: values.name,
      });
      logger.trace({
        context: "ProfileUpdateModal.onSubmit.profile",
        profile: {
          ...result,
          password: "*REDACTED*",
        },
      });
      // TODO Update the Profile in the user's Session
      /*
            if (status === "authenticated") {
                await update({ profile: { email: values.email, name: values.name}});
            }
*/
    } catch (error) {
      // TODO - error handling
      logger.error({
        context: "ProfileUpdateModal.onSubmit.error",
        message: (error as Error).message,
      });
    } finally {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Update Your Profile Settings
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Email Address:
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="email"
                        autoFocus
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                        placeholder="Enter email address"
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Full Name:
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="name"
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                        placeholder="Enter full name"
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
