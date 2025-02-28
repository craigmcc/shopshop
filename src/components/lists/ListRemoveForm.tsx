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

const isTesting = process.env.NODE_ENV === "test";

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

    logger.trace({
      context: "ListRemoveForm.performRemove",
      list,
    });

    setIsRemoving(true);
    const response = await removeList(list.id);
    setIsRemoving(false);

    if (response.model) {
      setResult(null);
      toast.success(`List '${list.name}' was successfully removed`);
      // Work around testing issue with mock router
      if (isTesting) {
        setResult("Success");
      } else {
        router.push("/lists");
      }
    } else {
      setResult(response.message!);
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
