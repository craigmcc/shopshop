"use client"
// @/components/lists/ListInviteModal.tsx

/**
 * Instructions to invite an existing user to become a member
 * of this List.
 *
 * Required ModalData:
 * - list                               List to which user is being invited
 * - profile                            Profile of signed in user
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useState} from "react";

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/shared/Icons";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ModalType, useModalStore} from "@/hooks/useModalStore";
import {useOrigin} from "@/hooks/useOrigin";

// Public Objects ------------------------------------------------------------

export const ListInviteModal = () => {

    const [copied, setCopied] = useState<boolean>(false);
    const {data, isOpen, onClose, onOpen, type} = useModalStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = isOpen && type === ModalType.LIST_INVITE;
    const {list} = data;
    const origin = useOrigin();
    const inviteURL = `${origin}/invite/${list?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteURL);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                    <DialogDescription className="text-xs text-center">
                        Ask your friends to sign in, and enter this URL
                        in the Location Bar.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6">
                    <Label
                        className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                        List Invite URL
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteURL}
                        />
                        <Button disabled={isLoading} onClick={onCopy} size="icon">
                            {copied
                                ? <Icons.Check className="w-4 h-4" />
                                : <Icons.Copy className="w-4 h-4" />
                            }
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )

}
