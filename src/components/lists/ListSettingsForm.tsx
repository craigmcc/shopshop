"use client";

// @/components/lists/ListSettingsForm.tsx

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
  // List to be updated (or undefined for create)
  list?: List,
}

export function ListSettingsForm({ list }: Props ) {

  const isCreating = !list;
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [result, setResult] = useState<string | Error | null>(null);

  const defaultValuesCreate: ListCreateSchemaType = {
    name: "",
    private: false,
  }
  const defaultValuesUpdate: ListUpdateSchemaType = {
    name: list?.name ?? "",
    private: list?.private ?? false,
  }
  logger.trace({
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

    logger.trace({
      context: "ListSettingsForm.submitForm",
      formData,
      isCreating,
    });

    setIsSaving(true);
    const response: ActionResult<List> = isCreating
      ? await createList(formData as ListCreateSchemaType)
      : await updateList(list!.id, formData as ListUpdateSchemaType);
    setIsSaving(false);

    if (response.model) {
      setResult(null);
      toast.success(`List '${formData.name}' was successfully ${isCreating ? "created" : "updated"}`);
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
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        {/*<h2 className="card-title justify-center">{ isCreating ? "Create List" : "Update List" }</h2>*/}
        {result && <ServerResponse result={result} />}
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-2"
            name="ListSettingsForm"
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
