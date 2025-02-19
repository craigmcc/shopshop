"use client";

// @/components/lists/CategoryForm.tsx

/**
 * Form for creating and editing Categories.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { Category, List, Profile } from "@prisma/client";
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

// Public Objects ------------------------------------------------------------

/* The properties for this component */
type Props = {
  /* The Category to be updated (for update only) */
  category: Category | undefined,
  /* The List owning this Category (for create only) */
  list: List | undefined,
  /* The signed in Profile */
  profile: Profile,
}

export function CategoryForm({ category, list, profile }: Props ) {

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
  logger.info({
    context: "CategoryForm",
    category: category,
    profile,
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

    try {

      logger.info({
        context: "CategoryForm.submitForm",
        formData,
        isCreating,
      });

      setIsSaving(true);
      if (isCreating) {
        await createCategory(formData as CategoryCreateSchemaType);
      } else {
        await updateCategory(category.id, formData as CategoryUpdateSchemaType);
      }
      setIsSaving(false);
      setResult(null);
      toast.success(`Category "${formData.name}" was successfully ${isCreating ? "created" : "updated"}`);
      router.push("/lists");

    } catch (error) {

      setIsSaving(false);
      logger.info({
        message: "Error creating or updating Category",
        error
      });
      setResult(error instanceof Error ? error : `${error}`);

    }
  }

  return (
    <div className={"card bg-base-300 shadow-xl"}>
      <div className="card-body">
        <h2 className="card-title justify-center">{ isCreating ? "Create Category" : "Update Category" }</h2>
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
