"use client";

// @/components/items/ItemSettingsForm.tsx

/**
 * Form for creating and editing Items.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, Item } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { createItem, updateItem } from "@/actions/ItemActions";
import { ServerResult } from "@/components/shared/ServerResult";
import { useAppForm } from "@/components/tanstack-form/useAppForm";
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
  item?: Item,
}

export function ItemSettingsForm({ category, item }: Props ) {

  const isCreating = !item;
  const [result, setResult] = useState<ActionResult<Item> | null>(null);
  const router = useRouter();

  const defaultValuesCreate: ItemCreateSchemaType = {
    categoryId: category.id,
    checked: false,
    listId: category.listId,
    name: "",
    notes: "",
    selected: false,
  }
  const defaultValuesUpdate: ItemUpdateSchemaType = {
    checked: item?.checked ?? false,
    name: item?.name ?? "",
    selected: item?.selected ?? false,
  }

  const form = useAppForm({
    defaultValues: isCreating ? defaultValuesCreate : defaultValuesUpdate,
    onSubmit: async ({ value }) => {
      await submitForm(value);
    },
    validators: {
      onBlur: isCreating ? ItemCreateSchema : ItemUpdateSchema,
      onChange: isCreating ? ItemCreateSchema : ItemUpdateSchema,
    },
  });

  async function submitForm(formData: ItemCreateSchemaType | ItemUpdateSchemaType) {

    logger.trace({
      context: "ItemSettingsForm.submitForm.input",
      formData,
      isCreating,
    });

    const response = isCreating
      ? await createItem(formData as ItemCreateSchemaType)
      : await updateItem(item.id, formData as ItemUpdateSchemaType);
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
        router.push(`/lists/${category.listId}/items?categoryId=${category.id}`);
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
          name="ItemSetingsForm"
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
                  label="Item Name"
                  placeholder="Item Name"
                />}
            </form.AppField>
            {isCreating && <input type="hidden" name="categoryId" value={category.id}/>}
            {isCreating && <input type="hidden" name="listId" value={category.listId}/>}
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
