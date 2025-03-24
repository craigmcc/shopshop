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
import { ServerResult } from "@/components/shared/ServerResult";
import { ActionResult } from "@/lib/ActionResult";
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
  const [result, setResult] = useState<ActionResult<Category> | null>(null);

  const performRemove = async () => {

    logger.trace({
      context: "CategoryRemoveForm.performRemove.input",
      category,
      list,
    });

    setIsRemoving(true);
    const response = await removeCategory(category.id);
    setIsRemoving(false);

    logger.trace({
      context: "CategoryRemoveForm.performRemove.output",
      response,
    });

    if (response.model) {
      setResult(null);
      toast.success(`Category '${category.name}' was successfully removed`);
      // Work around testing issue with mock router
      if (isTesting) {
        setResult({ message: "Success" });
      } else {
        router.back();
      }
    } else {
      setResult(response);
    }

  }

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">
          <ServerResult result={result} />
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
