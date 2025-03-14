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
import { ServerResponse } from "@/components/shared/ServerResponse";
import { logger } from "@/lib/ClientLogger";
import {
  CategoryCreateSchema,
  type CategoryCreateSchemaType,
  CategoryUpdateSchema,
  type CategoryUpdateSchemaType
} from "@/zod-schemas/CategorySchema";

const isTesting = process.env.NODE_ENV === "test";

// Public Objects ------------------------------------------------------------

/* The properties for this component */
type Props = {
  /* The Category to be updated (for update only) */
  category?: Category | undefined,
  /* List that owns this Category */
  list: List,
}

export function CategorySettingsForm({ category, list }: Props ) {

  const isCreating = !category;
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [result, setResult] = useState<string | Error | null>(null);

  const defaultValuesCreate: CategoryCreateSchemaType = {
    listId: list?.id ?? "",
    name: "",
  }
  const defaultValuesUpdate: CategoryUpdateSchemaType = {
    name: category?.name ?? "",
  }
  logger.trace({
    context: "CategoryForm",
    category: category,
    defaultValues: isCreating ? defaultValuesCreate : defaultValuesUpdate,
  });
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
      context: "CategorySettingsForm.submitForm",
      formData,
      isCreating,
    });

    setIsSaving(true);
    const response = isCreating
      ? await createCategory(formData as CategoryCreateSchemaType)
      : await updateCategory(category.id, formData as CategoryUpdateSchemaType);
    setIsSaving(false);

    logger.trace({
      context: "CategorySettingsForm.submitForm.response",
      response,
    });

    if (response.model) {
      setResult(null);
      toast.success(`Category "${formData.name}" was successfully ${isCreating ? "created" : "updated"}`);
      // Work around testing issue with mock router
      if (isTesting) {
        setResult("Success");
      } else {
        router.push(`/lists/${list.id}/categories`);
      }
    } else {
      setResult(response.message!);
    }

  }

  return (
    <div className={"card bg-base-300 shadow-xl"}>
      <div className="card-body">
        {result && <ServerResponse result={result} />}
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
