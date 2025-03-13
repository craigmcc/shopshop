"use client";

// @components/lists/ItemRemoveForm.tsx

/**
 * Form for removing a Item.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Item } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { removeItem } from "@/actions/ItemActions";
import { ServerResponse } from "@/components/shared/ServerResponse";
import { logger } from "@/lib/ClientLogger";

const isTesting = process.env.NODE_ENV === "test";

// Public Objects ------------------------------------------------------------

type Props = {
  // Item to be removed
  item: Item,
}

export function ItemRemoveForm({ item }: Props) {

  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [result, setResult] = useState<string | Error | null>(null);

  const performRemove = async () => {

    logger.trace({
      context: "ItemRemoveForm.performRemove",
      item: item,
    });

    setIsRemoving(true);
    const response = await removeItem(item.id);
    setIsRemoving(false);

    if (response.model) {
      setResult(null);
      toast.success(`Item '${item.name}' was successfully removed`);
      // Work around testing issue with mock router
      if (isTesting) {
        setResult("Success");
      } else {
        // TODO - decide where to go after removing an Item
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
        { item && (
          <>
            <h5
              className="gap-2"
            >
              Are you sure you want to remove  Item &quot;{item.name}&quot;?
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
