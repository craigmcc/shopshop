// @/components/lists/ListRemoveForm.tsx

"use client"

/**
 * Form for confirming removal of a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

// Internal Modules ----------------------------------------------------------

import { removeListAction } from "@/actions/listActions";
import { DisplayServerActionResponse} from "@/components/shared/DisplayServerActionResponse";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  listId: string,
  message?: string,
  profile: Profile,
}

export function ListRemoveForm({ listId, message/*, profile*/ }: Props) {

  const router = useRouter();
  const { toast } = useToast();
  const id = listId;

  function performListRemove() {
    executeRemove({ id, message });
    logger.info({
      context: "ListRemoveForm.performListRemove",
      listId: listId,
      message: "Successful list removal",
    });
    router.push("/");
  }

  const {
//    isPending: isRemoving,
    execute: executeRemove,
    result: removeResult,
  } = useAction(removeListAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast({
          description: data.message,
          title: "Success! 🎉",
          variant: "default",
        });
      }
      router.push("/lists");
    },
    onError({ error }) {
      logger.error({
        context: "ListRemoveForm.onError",
        error,
      });
      toast({
        description: "Remove Failed",
        title: "Error",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex flex-col gap-4 justify-center items-center sm:px-8">
      <DisplayServerActionResponse result={removeResult}/>
      <h5>Are you sure you want to remove this List?</h5>
      <form action={performListRemove}>
        <Button
          className="mr-4"
          title="Remove List"
          type="submit"
          variant="destructive"
        >
          Remove List
        </Button>
        <Button
          onClick={() => router.push("/lists")}
          title="Back"
          variant="default"
        >
          Back
        </Button>
      </form>
    </div>
  );

}
