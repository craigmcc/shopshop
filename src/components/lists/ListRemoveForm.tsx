"use client";

// @components/lists/ListRemoveForm.tsx

/**
 * Form for removing a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { removeList } from "@/actions/ListActions";
import { ServerResponse } from "@/components/shared/ServerResponse";
import { logger } from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  // List to be removed
  list: List,
}

export function ListRemoveForm({ list }: Props) {

  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [result, setResult] = useState<string | Error | null>(null);

  const performRemove = async () => {

    try {

      logger.info({
        context: "ListRemoveForm.performRemove",
        list,
      });

      setIsRemoving(true);
      await removeList(list.id);
      setIsRemoving(false);
      toast.success(`List '${list.name}' was successfully removed`);
      router.push("/lists");

    } catch (error) {

      setIsRemoving(false);
      logger.info({
        context: "ListRemoveForm.performRemove.error",
        message: "Error removing List",
        error,
      });
      setResult(error instanceof Error ? error : `${error}`);

    }

  }

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">
          {result && <ServerResponse result={result} />}
        </h2>
        { list && (
          <>
            <h5
              className="gap-2"
            >
              Are you sure you want to remove  List &quot;{list.name}&quot;?
            </h5>
            <button
              className="btn btn-warning justify-center"
              onClick={performRemove}
              type="button"
            >
              {isRemoving ? (
                <>
                  <LoaderCircle className="animate-spin"/>Removing
                </>
              ): "Remove" }
            </button>
          </>
        )}
      </div>
    </div>
  )

}
