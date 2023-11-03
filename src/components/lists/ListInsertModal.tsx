"use client"
// @/components/lists/ListInsertModal.tsx

/**
 * Create a new List.
 *
 * Required ModalData:
 * - profile                            Profile of current user
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {v4 as uuidv4} from "uuid";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

// Internal Modules ----------------------------------------------------------

import * as ListActions from "@/actions/ListActions";
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

export const ListInsertModal = () => {

    const {data, isOpen, onClose, type} = useModalStore();
    const router = useRouter();
    const profile = data.profile;
    const isModalOpen = isOpen && type === ModalType.LIST_INSERT;

    logger.info({
        context: "ListInsertModal",
        data: data,
        isOpen: isOpen,
        type: type,
        profile: profile,
        isModalOpen: isModalOpen,
    });

    const formSchema = z.object({
        inviteCode: z.string().min(1, {
            message: "Invite Code is required",
        }),
        name: z.string().min(1, {
            message: "List name is required",
        }),
        profileId: z.string().min(1, {
            message: "Profile ID is required",
        }),
    });

    const form = useForm({
        defaultValues: {
            inviteCode: uuidv4(),
            name: "",
            profileId: profile ? profile.id : "",
        },
        resolver: zodResolver(formSchema),
    });
    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        form.reset();
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await ListActions.insert(values);
            form.reset();
            router.refresh();
        } catch (error) {
            // TODO - error handling
            console.log(error);
        } finally {
            onClose();
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create New List
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className="text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                    >
                                        List Name:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            autoFocus
                                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            disabled={isLoading}
                                            placeholder="Enter list name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="default" disabled={isLoading}>
                                Save
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

}
