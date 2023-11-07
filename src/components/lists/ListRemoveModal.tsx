"use client"
// @/components/lists/ListRemoveModal.tsx

/**
 * Remove an existing List.
 *
 * Required ModalData:
 * - list                               List to be removed
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";

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
import {ModalType, useModalStore} from "@/hooks/useModalStore";
import {logger} from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

export const ListRemoveModal = () => {

    const router = useRouter();
    const {data, isOpen, onClose, type} = useModalStore();
    const isModalOpen = isOpen && type === ModalType.LIST_REMOVE;
    const list = data.list;
    if (!list) {
        return null;
    }

    logger.info({
        context: "ListRemoveModal",
        data: data,
        isModalOpen: isModalOpen,
        type: type,
    });

    const onRemove = async () => {
        try {
            logger.info({
                context: "ListRemoveModal.onRemove",
                list: list,
            });
            await ListActions.remove(list!.id);
            router.refresh();
        } catch (error) {
            // TODO - error handling
            console.log(error);
        } finally {
            onClose();
            router.push("/");
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center font-bold">
                        Remove List
                    </DialogTitle>
                </DialogHeader>
                <div className="px-6 space-y-3">
                    <p>
                        Do you really want to remove list
                        &nbsp;<span className="font-bold">{list!.name}</span>?
                        This will eliminate it for all members!
                    </p>
                    <p>
                        If you just want to stop seeing this list yourself, use the
                        &nbsp;<span className="italic">Leave List</span>&nbsp;
                        option instead.
                    </p>
                </div>
                <DialogFooter className="bg-gray-100 dark:bg-gray-600 px-6 py-4">
                    <Button variant="destructive" onClick={onRemove}>
                        Remove
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}
