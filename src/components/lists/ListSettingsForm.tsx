"use client";

// @/components/lists/ListForm.tsx

/**
 * Form for creating and editing Lists.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { List } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { createList, updateList } from "@/actions/ListActions";
import { InputField } from "@/components/daisyui/InputField";
import { ServerResponse } from "@/components/shared/ServerResponse";
import { logger } from "@/lib/ClientLogger";
import {
  ListCreateSchema,
  type ListCreateSchemaType,
  ListUpdateSchema,
  type ListUpdateSchemaType
} from "@/zod-schemas/ListSchema";

// Public Objects ------------------------------------------------------------

type Props = {
  // List to be updated (or undefined for create)
  list: List | undefined,
}

export function ListSettingsForm({ list }: Props ) {

  const isCreating = !list;
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [result, setResult] = useState<string | Error | null>(null);

  const defaultValuesCreate: ListCreateSchemaType = {
    name: "",
  }
  const defaultValuesUpdate: ListUpdateSchemaType = {
    name: list?.name ?? "",
  }
  logger.info({
    context: "ListSettingsForm",
    list,
    defaultValues: isCreating ? defaultValuesCreate : defaultValuesUpdate,
  });
  const methods = useForm<ListCreateSchemaType | ListUpdateSchemaType>({
    defaultValues: isCreating ? defaultValuesCreate : defaultValuesUpdate,
    mode: "onBlur",
    // @ts-expect-error Type weirdness on resolver property
    resolver: isCreating ? zodResolver(ListCreateSchema) : zodResolver(ListUpdateSchema),
  });
  const formState = methods.formState;
  const errors = formState.errors;

  async function submitForm(formData: ListCreateSchemaType | ListUpdateSchemaType) {

    try {

      logger.info({
        context: "ListSettingsForm.submitForm",
        formData,
        isCreating,
      });

      setIsSaving(true);
      if (isCreating) {
        await createList(formData as ListCreateSchemaType);
      } else {
        await updateList(list.id, formData as ListUpdateSchemaType);
      }
      setIsSaving(false);
      setResult(null);
      toast.success(`List '${formData.name}' was successfully ${isCreating ? "created" : "updated"}`);
      router.push("/lists");

    } catch (error) {

      setIsSaving(false);
      logger.info({
        context: "ListSettingsForm.submitForm.error",
        message: "Error creating or updating List",
        error,
      });
      setResult(error instanceof Error ? error : `${error}`);

    }
  }

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">{ isCreating ? "Create List" : "Update List" }</h2>
        {result && <ServerResponse result={result} />}
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-2"
            name="ListForm"
            onSubmit={methods.handleSubmit(submitForm)}
          >
            <div className="flex flex-col w-full gap-2">
              <InputField
                autoFocus={true}
                label="List Name"
                name="name"
                placeholder="List Name"
                type="text"
              />
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
