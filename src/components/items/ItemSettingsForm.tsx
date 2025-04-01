"use client";

// @/components/lists/ItemSettingsForm.tsx

/**
 * Form for creating and editing Items.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Item } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { createItem, updateItem } from "@/actions/ItemActions";
import { InputField } from "@/components/daisyui/InputField";
import { ServerResult } from "@/components/shared/ServerResult";
import { ActionResult } from "@/lib/ActionResult";
import { logger } from "@/lib/ClientLogger";
import {
  ItemCreateSchema,
  type ItemCreateSchemaType,
  ItemUpdateSchema,
  type ItemUpdateSchemaType
} from "@/zod-schemas/ItemSchema";

const isTesting = process.env.NODE_ENV === "test";

// Public Objects ------------------------------------------------------------

type Props = {
  /* Category owning this Item */
  category: Category,
  /* Item to be updated (for update only) */
  item?: Item | undefined,
}

export function ItemSettingsForm({ category, item }: Props ) {

  const isCreating = !item;
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [result, setResult] = useState<ActionResult<Item> | null>(null);

  logger.trace({
    context: "ItemSettingsForm",
    category,
    item,
  });

  const defaultValuesCreate: ItemCreateSchemaType = {
    categoryId: category?.id ?? "",
    checked: false,
    listId: category?.listId ?? "",
    name: "",
    notes: "",
    selected: false,
  }
  const defaultValuesUpdate: ItemUpdateSchemaType = {
    checked: item?.checked ?? false,
    name: item?.name ?? "",
    selected: item?.selected ?? false,
  }

  const methods = useForm<ItemCreateSchemaType | ItemUpdateSchemaType>({
    defaultValues: isCreating ? defaultValuesCreate : defaultValuesUpdate,
    mode: "onBlur",
    // @ts-expect-error Type weirdness on resolver property
    resolver: isCreating ? zodResolver(ItemCreateSchema) : zodResolver(ItemUpdateSchema),
  });
  const formState = methods.formState;
  const errors = formState.errors;

  async function submitForm(formData: ItemCreateSchemaType | ItemUpdateSchemaType) {

    logger.trace({
      context: "ItemSettingsForm.submitForm.input",
      formData,
      isCreating,
    });

    setIsSaving(true);
    const response = isCreating
      ? await createItem(formData as ItemCreateSchemaType)
      : await updateItem(item.id, formData as ItemUpdateSchemaType);
    setIsSaving(false);

    logger.trace({
      context: "ItemSettingsForm.submitForm.output",
      response,
    });

    if (response.model) {
      setResult(null);
      toast.success(`Item "${formData.name}" was successfully ${isCreating ? "created" : "updated"}`);
      // Work around testing issue with mock router
      if (isTesting) {
        setResult({message: "Success"});
      } else {
        router.push(`/lists/${category.listId}/categories/${category?.id}/items`);
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
            name="ItemForm"
            onSubmit={methods.handleSubmit(submitForm)}
          >
            <div className="flex flex-col w-full gap-2">
              <InputField
                autoFocus={true}
                label="Item Name"
                name="name"
                placeholder="Item Name"
                type="text"
              />
              {isCreating && <input type="hidden" name="categoryId" value={category.id}/>}
              {isCreating && <input type="hidden" name="listId" value={category.listId}/>}
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
