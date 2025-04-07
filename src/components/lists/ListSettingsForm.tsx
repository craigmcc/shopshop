"use client";

// @/components/lists/ListSettingsForm.tsx

/**
 * Form for creating and editing Lists.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { createList, updateList } from "@/actions/ListActions";
import { ServerResult } from "@/components/shared/ServerResult";
import { useAppForm } from "@/components/tanstack-form/useAppForm";
import { useCurrentListContext } from "@/contexts/CurrentListContext";
import { ActionResult } from "@/lib/ActionResult";
import { logger } from "@/lib/ClientLogger";
import {
  ListCreateSchema,
  type ListCreateSchemaType,
  ListUpdateSchema,
  type ListUpdateSchemaType
} from "@/zod-schemas/ListSchema";

const isTesting = process.env.NODE_ENV === "test";

// Public Objects ------------------------------------------------------------

type Props = {
  // List to be updated (for update only)
  list?: List | undefined,
}

export function ListSettingsForm({ list }: Props ) {

  const isCreating = !list;
  const [result, setResult] = useState<ActionResult<List> | null>(null);
  const router = useRouter();

  const { changeCurrentList } = useCurrentListContext();
  logger.trace({
    context: "ListSettingsForm.settingCurrentList",
    list,
  });
  changeCurrentList(list ?? null);

  const defaultValuesCreate: ListCreateSchemaType = {
    name: "",
    private: false,
  }
  const defaultValuesUpdate: ListUpdateSchemaType = {
    name: list?.name ?? "",
    private: list?.private ?? false,
  }

  const form = useAppForm({
    defaultValues: isCreating ? defaultValuesCreate : defaultValuesUpdate,
    onSubmit: async ({ value }) => {
      await submitForm(value);
    },
    validators: {
      onBlur: isCreating ? ListCreateSchema : ListUpdateSchema,
      onChange: isCreating ? ListCreateSchema : ListUpdateSchema,
    },
  })

  async function submitForm(formData: ListCreateSchemaType | ListUpdateSchemaType) {

    logger.trace({
      context: "ListSettingsForm.submitForm.input",
      formData,
      isCreating,
    });
    const response: ActionResult<List> = isCreating
      ? await createList(formData as ListCreateSchemaType)
      : await updateList(list!.id, formData as ListUpdateSchemaType);
    logger.trace({
      context: "ListSettingsForm.submitForm.output",
      response,
    });

    if (response.model) {
      setResult(null);
      toast.success(`List '${formData.name}' was successfully ${isCreating ? "created" : "updated"}`);
      // Work around testing issue with mock router
      if (isTesting) {
        setResult({message: "Success"});
      } else {
        logger.trace({
          context: "ListSettingsForm.resettingCurrentList",
        })
        changeCurrentList(response.model);
        router.push("/lists");
      }
    } else {
      setResult(response);
    }

  }

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        {result && (
          <h2 className="card-title justify-center">
            <ServerResult result={result} />
          </h2>
        )}
        <form
          className="flex flex-col gap-2"
          name="ListSettingsForm"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppField name="name">
            {(field) =>
              <field.InputField
                autoFocus
                label="List Name"
                placeholder="List Name"
              />}
          </form.AppField>
          <form.AppForm>
            <div className="flex flex-row justify-between">
              <form.ResetButton/>
              <form.SubmitButton isCreating={isCreating}/>
            </div>
          </form.AppForm>
        </form>
      </div>
    </div>
  );

}
