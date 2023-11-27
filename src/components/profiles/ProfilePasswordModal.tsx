"use client";
// @/components/profiles/ProfilePasswordModal.tsx

/**
 * Form for changing a Profile's password.
 *
 * Required ModalData:
 * - profile                            Profile whose password is to be changed
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useRouter } from "next/navigation";
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

export const ProfilePasswordModal = () => {
  const { data, isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === ModalType.PROFILE_PASSWORD;
  const profile = data.profile;
  const router = useRouter();

  logger.trace({
    context: "ProfilePasswordModal",
    isModalOpen: isModalOpen,
    type: type,
  });

  const formSchema = z
    .object({
      password1: z.string().min(1, {
        message: "Password is required",
      }), // TODO - password strength check
      password2: z.string().min(1, {
        message: "Confirmation password is required",
      }),
    })
    .refine((data) => data.password1 === data.password2, {
      message: "Password and Confirmation Password must match",
      path: ["password2"],
    });

  const form = useForm({
    defaultValues: {
      password1: "",
      password2: "",
    },
    mode: "onBlur",
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    logger.trace({
      context: "ProfilePasswordModal.handleClose",
    });
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      logger.trace({
        context: "ProfilePasswordModal.onSubmit.request",
        password1: "*REDACTED*",
        password2: "*REDACTED*",
      });
      const result = await ProfileActions.update(profile!.id, {
        password: values.password1,
      });
      logger.trace({
        context: "ProfilePasswordModal.onSubmit.profile",
        profile: {
          ...result,
          password: "*REDACTED*",
        },
      });
    } catch (error) {
      // TODO - error handling
      logger.error({
        context: "ProfilePasswordModal.onSubmit.error",
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
            Change Your Sign In Password
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="password1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Password:
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="new-password"
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                        placeholder="Enter desired password"
                        type="password"
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
                name="password2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Confirm Password:
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="new-password"
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                        placeholder="Enter confirm password"
                        type="password"
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
