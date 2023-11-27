"use client";
// @/components/auth/SignInForm.tsx

/**
 * Sign In form for next-auth.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Internal Modules ----------------------------------------------------------

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
import { logger } from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

export const SignInForm = () => {
  logger.trace({
    context: "SignInForm",
  });

  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formSchema = z.object({
    email: z.string().email({
      message: "Valid email address is required",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    logger.trace({
      context: "SignInForm.handleClose",
    });
    form.reset();
    router.push("/");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      logger.trace({
        context: "SignInForm.onSubmit.request",
        email: values.email,
        password: "*REDACTED*",
      });
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      logger.trace({
        context: "SignInForm.onSubmit.response",
        response: response,
      });
      if (!response?.error) {
        router.push("/");
        router.refresh();
      } else {
        alert("Invalid email address or password, please try again.");
      }
    } catch (error) {
      // TODO - error handling
      logger.error({
        context: "SignInForm.onSubmit.error",
        message: (error as Error).message,
      });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Sign In to ShopShop
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Password:
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="current-password"
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                        placeholder="Enter password"
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
                Sign In
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
