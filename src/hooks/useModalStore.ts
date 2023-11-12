// @/hooks/useModalStore.ts

/**
 * Zustand-based store for managing opening and closing modals.
 *
 * Based on "hooks/use-modal-store.ts" from
 * https://github.com/AntonioErdeljac/next13-discord-clone.git
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {create} from "zustand";

import {
    Category,
    Item,
    List,
    Member,
    Profile,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Identifiers for modals that can be managed.
 */
export enum ModalType {
    CATEGORY_INSERT = "CategoryInsert",
    CATEGORY_REMOVE = "CategoryRemove",
    CATEGORY_UPDATE = "CategoryUpdate",
    ITEM_INSERT = "ItemInsert",
    ITEM_REMOVE = "ItemRemove",
    ITEM_UPDATE = "ItemUpdate",
    LIST_FORM = "ListForm",
    LIST_INVITE = "ListInvite",
    LIST_LEAVE = "ListLeave",
    LIST_MEMBERS = "ListMembers",
    LIST_REMOVE = "ListRemove",
    PROFILE_PASSWORD = "ProfilePassword",
    PROFILE_UPDATE = "ProfileUpdate",
    PROFILE_SIGNUP = "ProfileSignUp",
}

/**
 * Various data items that might be associated with a particular modal.
 */
interface ModalData {
    // Data models
    category?: Category;
    item?: Item;
    list?: List;
    member?: Member;
    profile?: Profile;
    // Generic properties
    query?: Record<string, any>;
}

/**
 * Contents of the store for a modal.
 */
interface ModalStore {
    data: ModalData;
    isOpen: boolean;
    onClose: () => void;
    onOpen: (type: ModalType, data?: ModalData) => void;
    type: ModalType | null;
}

/**
 * Hook-like declaration of a modal store.
 */
export const useModalStore = create<ModalStore>((set) => ({
    data: {},
    isOpen: false,
    onClose: () => set({isOpen: false, data: {}, type: null }),
    onOpen: (type, data = {}) => {
        set({data, isOpen: true, type});
    },
    type: null,
}));
