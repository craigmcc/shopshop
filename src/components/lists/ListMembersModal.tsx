"use client";
// @/components/lists/ListMembersModal.tsx

/**
 * Table for managing Members role, and/or kicking them out.
 *
 * Required ModalData:
 * - list                               ListWithMembersWithProfiles
 *                                      for the List being managed
 * - profile                            Profile of signed in user
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MemberRole } from "@prisma/client";

// Internal Modules ---------------------------------------------------------

import * as MemberActions from "@/actions/MemberActions";
import { ProfileAvatar } from "@/components/profiles/ProfileAvatar";
import { Icons } from "@/components/shared/Icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModalType, useModalStore } from "@/hooks/useModalStore";
import { logger } from "@/lib/ClientLogger";
import { ListWithMembersWithProfiles } from "@/types/types";

const roleIconMap = {
  [MemberRole.ADMIN]: <Icons.Admin className="h-4 w-4 text-rose-500" />,
  [MemberRole.GUEST]: <Icons.Guest className="h-4 w-4 text-indigo-500" />,
};

// Public Objects ------------------------------------------------------------

export const ListMembersModal = () => {
  const { data, isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === ModalType.LIST_MEMBERS;
  const { list } = data as { list: ListWithMembersWithProfiles };
  const profile = data.profile;
  const [loadingId, setLoadingId] = useState<string>("");
  const router = useRouter();

  logger.info({
    context: "ListMembersModal",
    data: data,
    isModalOpen: isModalOpen,
    type: type,
  });

  const onKick = async (memberId: string) => {
    try {
      logger.info({
        context: "ListMembersModal.onKick",
        list: list,
        memberId: memberId,
      });
      setLoadingId(memberId);
      await MemberActions.remove(memberId);
      router.refresh();
      // TODO - get revised list data
    } catch (error) {
      // TODO - error handling
      console.error(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      logger.info({
        context: "ListMembersModal.onRoleChange",
        list: list,
        memberId: memberId,
        role: role,
      });
      setLoadingId(memberId);
      await MemberActions.updateRole(memberId, role);
      router.refresh();
      // TODO - get revised list data
    } catch (error) {
      // TODO - error handling
      console.error(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {list?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {list?.members?.map((member) => (
            <div key={member.id} className="mb-6 flex items-center gap-x-2">
              <ProfileAvatar
                profile={member.profile}
                profileId={profile ? profile.id : ""}
              />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-1 text-xs font-semibold">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {list.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Icons.MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <Icons.ShieldQuestion className="mr-2 h-4 w-4" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, "ADMIN")}
                              >
                                <Icons.ShieldCheck className="mr-2 h-4 w-4" />
                                Admin
                                {member.role === "ADMIN" && (
                                  <Icons.Check className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, "GUEST")}
                              >
                                <Icons.Shield className="mr-2 h-4 w-4" />
                                Guest
                                {member.role === "GUEST" && (
                                  <Icons.Check className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <Icons.Kick className="mr-2 h-4 w-4" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Icons.Loader className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
