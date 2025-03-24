"use client";

// @/components/lists/CategorySettingsForm.tsx

/**
 * Form for creating and editing Categories.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { Category, List } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { createCategory, updateCategory } from "@/actions/CategoryActions";
import { InputField } from "@/components/daisyui/InputField";
import { ServerResult } from "@/components/shared/ServerResult";
import { ActionResult } from "@/lib/ActionResult";
import { logger } from "@/lib/ClientLogger";
import {
  CategoryCreateSchema,
  type CategoryCreateSchemaType,
  CategoryUpdateSchema,
  type CategoryUpdateSchemaType
} from "@/zod-schemas/CategorySchema";

const isTesting = process.env.NODE_ENV === "test";

// Public Objects ------------------------------------------------------------

type Props = {
  /* Category to be updated (for update only) */
  category?: Category | undefined,
  /* List that owns this Category */
  list: List,
}

export function CategorySettingsForm({ category, list }: Props ) {

  const isCreating = !category;
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [result, setResult] = useState<ActionResult<Category> | null>(null);

  logger.trace({
    context:  "CategorySettingsForm",
    category,
    list,
  });

  const defaultValuesCreate: CategoryCreateSchemaType = {
    listId: list?.id ?? "",
    name: "",
  }
  const defaultValuesUpdate: CategoryUpdateSchemaType = {
    name: category?.name ?? "",
  }

  const methods = useForm<CategoryCreateSchemaType | CategoryUpdateSchemaType>({
    defaultValues: isCreating ? defaultValuesCreate : defaultValuesUpdate,
    mode: "onBlur",
    // @ts-expect-error Type weirdness on resolver property
    resolver: isCreating ? zodResolver(CategoryCreateSchema) : zodResolver(CategoryUpdateSchema),
  });
  const formState = methods.formState;
  const errors = formState.errors;

  async function submitForm(formData: CategoryCreateSchemaType | CategoryUpdateSchemaType) {

    logger.trace({
      context: "CategorySettingsForm.submitForm.input",
      formData,
      isCreating,
    });

    setIsSaving(true);
    const response = isCreating
      ? await createCategory(formData as CategoryCreateSchemaType)
      : await updateCategory(category.id, formData as CategoryUpdateSchemaType);
    setIsSaving(false);

    logger.trace({
      context: "CategorySettingsForm.submitForm.output",
      response,
    });

    if (response.model) {
      setResult(null);
      toast.success(`Category "${formData.name}" was successfully ${isCreating ? "created" : "updated"}`);
      // Work around testing issue with mock router
      if (isTesting) {
        setResult({message: "Success"});
      } else {
        router.back();
      }
    } else {
      setResult(response);
    }

  }

  return (
    <div className={"card bg-base-300 shadow-xl"}>
      <div className="card-body">
        <h2 className="card-title justify-center">
          <ServerResult result={result} />
        </h2>
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-2"
            name="CategoryForm"
            onSubmit={methods.handleSubmit(submitForm)}
          >
            <div className="flex flex-col w-full gap-2">
              <InputField
                autoFocus={true}
                label="Category Name"
                name="name"
                placeholder="Category Name"
                type="text"
              />
              {isCreating && <input type="hidden" name="listId" value={list?.id}/>}
              <button
                className="btn btn-primary"
                disabled={Object.keys(errors).length > 0}
                type="submit"
              >
                {isSaving ? (
                  <>
                    <LoaderCircle className="animate-spin"/>Saving
                  </>
                ) : "Save" }
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );

}
