"use client";

// @components/categories/CategoryRemoveForm.tsx

/**
 * Form for removing a Category.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, List } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { removeCategory } from "@/actions/CategoryActions";
import { ServerResponse } from "@/components/shared/ServerResponse";
import { logger } from "@/lib/ClientLogger";

const isTesting = process.env.NODE_ENV === "test";

// Public Objects ------------------------------------------------------------

type Props = {
  // Category to be removed
  category: Category,
  // List that owns this Category
  list: List,
}

export function CategoryRemoveForm({ category, list }: Props) {

  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [result, setResult] = useState<string | Error | null>(null);

  const performRemove = async () => {

    logger.trace({
      context: "CategoryRemoveForm.performRemove",
      category,
    });

    setIsRemoving(true);
    const response = await removeCategory(category.id);
    setIsRemoving(false);

    if (response.model) {
      setResult(null);
      toast.success(`Category '${category.name}' was successfully removed`);
      // Work around testing issue with mock router
      if (isTesting) {
        setResult("Success");
      } else {
        // TODO - decide where to go after removing a Category
        router.push(`/lists/${list.id}/categories`);
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
        { category && (
          <>
            <h5
              className="gap-2"
            >
              Are you sure you want to remove  Category &quot;{category.name}&quot;?
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
