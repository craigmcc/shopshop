"use client"
// @/components/auth/SignUpModal.tsx

/**
 * Sign Up form for creating a new Profile.
 *
 * Required ModalData:                  None
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import {useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

// Internal Modules ----------------------------------------------------------

import * as ProfileActions from "@/actions/ProfileActions";
import {Button} from "@/components/ui/button";
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
    FormMessage
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {ModalType, useModalStore} from "@/hooks/useModalStore";
import {logger} from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

export const SignUpModal = () => {

    const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
        ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY : "unknown";
    const {isOpen, onClose, type} = useModalStore();
    const isModalOpen = isOpen && type === ModalType.PROFILE_SIGNUP;
    const router = useRouter();
    const [token, setToken] = useState<string>("");

    logger.trace({
        context: "SignUpModal",
        isModalOpen: isModalOpen,
        type: type,
    });

    const formSchema = z.object({
        email: z.string()
            .email("Must be a valid email address")
            .refine(async (value) => {
                const profile = await ProfileActions.email(value);
                return !profile;
            }, "That email address is already in use"),
        name: z.string().min(1, {
            message: "User name is required",
        }),
        password1: z.string().min(1, {
            message: "Password is required",
        }), // TODO - password strength check
        password2: z.string().min(1, {
            message: "Confirmation password is required",
        }),
    })

    const form = useForm({
        defaultValues: {
            email: "",
            name: "",
            password1: "",
            password2: "",
        },
        mode: "onBlur",
        resolver: zodResolver(formSchema),
    });
    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        logger.trace({
            context: "SignUpModal.handleClose",
        });
        form.reset();
        onClose();
    }

    const onSuccess = (theToken: string | null) => {
        setToken(theToken ? theToken : "");
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            logger.trace({
                context: "SignUpModal.onSubmit.request",
                email: values.email,
                name: values.name,
                password1: "*REDACTED*",
                password2: "*REDACTED*",
            });
            const profile = await ProfileActions.insert({
                email: values.email,
                name: values.name,
                password: values.password1,
            });
            logger.trace({
                context: "SignUpModal.onSubmit.profile",
                profile: {
                    ...profile,
                    password: "*REDACTED*",
                }
            })
            const response = await signIn("credentials", {
                email: values.email,
                password: values.password1,
                redirect: false,
            });
            logger.trace({
                context: "SignUpModal.onSubmit.response",
                response: response,
            });
            if (!response?.error) {
                router.push("/");
                router.refresh();
            } else {
                alert("Invalid email address or password, please try again");
            }
        } catch (error) {
            // TODO - error handling
            logger.error({
                context: "SignUpModal.onSubmit.error",
                message: (error as Error).message,
            });
        } finally {
            form.reset();
            onClose();
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader>
                    <DialogTitle className={"text-2xl text-center font-bold"}>
                        Sign Up for ShopShop
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
                                        <FormLabel
                                            className="text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Email Address:
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="email"
                                                autoFocus
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
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
                                        <FormLabel
                                            className="text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Full Name:
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="name"
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
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

                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="password1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Password:
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="new-password"
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
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
                                        <FormLabel
                                            className="text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Confirm Password:
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="new-password"
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
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

                        <DialogFooter className="bg-gray-100 dark:bg-gray-600 px-6 py-4">
                            <ReCAPTCHA
                                className="px-8"
                                onChange={onSuccess}
                                sitekey={RECAPTCHA_SITE_KEY}
                                size="compact"
                            />
                            <Button variant="default" disabled={isLoading}>
                                Sign Up
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

}
