"use client";

// @/components/categories/CategorySettingsForm.tsx

/**
 * Form for creating and editing Categories.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, List } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { createCategory, updateCategory } from "@/actions/CategoryActions";
import { ServerResult } from "@/components/shared/ServerResult";
import { useAppForm } from "@/components/tanstack-form/useAppForm";
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
  category?: Category,
  /* List that owns this Category */
  list: List,
}

export function CategorySettingsForm({ category, list }: Props ) {

  const isCreating = !category;
  const [result, setResult] = useState<ActionResult<Category> | null>(null);
  const router = useRouter();

  const defaultValuesCreate: CategoryCreateSchemaType = {
    listId: list.id,
    name: "",
  }
  const defaultValuesUpdate: CategoryUpdateSchemaType = {
    name: category?.name ?? "",
  }

  const form = useAppForm({
    defaultValues: isCreating ? defaultValuesCreate : defaultValuesUpdate,
    onSubmit: async ({ value }) => {
      await submitForm(value);
    },
    validators: {
      onBlur: isCreating ? CategoryCreateSchema : CategoryUpdateSchema,
      onChange: isCreating ? CategoryCreateSchema : CategoryUpdateSchema,
    }
  });

  async function submitForm(formData: CategoryCreateSchemaType | CategoryUpdateSchemaType) {

    logger.trace({
      context: "CategorySettingsForm.submitForm.input",
      formData,
      isCreating,
    });

    const response = isCreating
      ? await createCategory(formData as CategoryCreateSchemaType)
      : await updateCategory(category.id, formData as CategoryUpdateSchemaType);
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
        router.push(`/lists/${list.id}/categories`);
      }
    } else {
      setResult(response);
    }

  }

  return (
    <div className={"card bg-base-300 shadow-xl"}>
      <div className="card-body">
        {result && (
          <h2 className="card-title justify-center">
            <ServerResult result={result} />
          </h2>
        )}
          <form
            className="flex flex-col gap-2"
            name="CategorySettingsForm"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col w-full gap-2">
              <form.AppField name="name">
                {(field) =>
                  <field.InputField
                    autoFocus
                    label="Category Name"
                    placeholder="Category Name"
                  />}
              </form.AppField>
              {isCreating && <input type="hidden" name="listId" value={list.id}/>}
              <form.AppForm>
                <div className="flex flex-row justify-between">
                  <form.ResetButton/>
                  <form.SubmitButton/>
                </div>
              </form.AppForm>
            </div>
          </form>
      </div>
    </div>
  );

}
