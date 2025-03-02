"use client";

// @/components/lists/ItemSettingsForm.tsx

/**
 * Form for creating and editing Items.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Item, Profile } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { createItem, updateItem } from "@/actions/ItemActions";
import { InputField } from "@/components/daisyui/InputField";
import { ServerResponse } from "@/components/shared/ServerResponse";
import { logger } from "@/lib/ClientLogger";
import {
  ItemCreateSchema,
  type ItemCreateSchemaType,
  ItemUpdateSchema,
  type ItemUpdateSchemaType
} from "@/zod-schemas/ItemSchema";

const isTesting = process.env.NODE_ENV === "test";

// Public Objects ------------------------------------------------------------

/* The properties for this component */
type Props = {
  /* The Category owning this Item (for create only) */
  category?: Category,
  /* The Item to be updated (for update only) */
  item?: Item,
  /* The signed in Profile */
  profile: Profile,
}

export function ItemSettingsForm({ category, item, profile }: Props ) {

  const isCreating = !item;
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [result, setResult] = useState<string | Error | null>(null);

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
  logger.info({
    context: "ItemSettingsForm",
    category: category,
    item: item,
    profile: {
      ...profile,
      password: "*REDACTED*",
    },
    defaultValues: isCreating ? defaultValuesCreate : defaultValuesUpdate,
  });
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
      context: "ItemSettingsForm.submitForm",
      formData,
      isCreating,
    });

    setIsSaving(true);
    const response = isCreating
      ? await createItem(formData as ItemCreateSchemaType)
      : await updateItem(item.id, formData as ItemUpdateSchemaType);
    setIsSaving(false);

    if (response.model) {
      setResult(null);
      toast.success(`Item "${formData.name}" was successfully ${isCreating ? "created" : "updated"}`);
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
    <div className={"card bg-base-300 shadow-xl"}>
      <div className="card-body">
        <h2 className="card-title justify-center">{ isCreating ? "Create Item" : "Update Item" }</h2>
        {result && <ServerResponse result={result} />}
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
              {isCreating && <input type="hidden" name="categoryId" value={category?.id}/>}
              {isCreating && <input type="hidden" name="listId" value={category?.listId}/>}
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
