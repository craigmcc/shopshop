"use client";

// @/components/lists/ListForm.tsx

/**
 * Form for creating and editing Lists.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { List, Profile } from "@prisma/client";
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
  ListSchema,
  type ListSchemaType,
  ListSchemaUpdate,
  type ListSchemaUpdateType
} from "@/zod-schemas/ListSchema";

// Public Objects ------------------------------------------------------------

type Props = {
  list: List | undefined,               // For update only
  profile: Profile,                     // Signed in Profile
}

export function ListForm({ list, profile }: Props ) {

  const isCreating = !list;
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [result, setResult] = useState<string | Error | null>(null);

  const defaultValuesCreate: ListSchemaType = {
    name: "",
  }
  const defaultValuesUpdate: ListSchemaUpdateType = {
    name: list?.name ?? "",
  }
  logger.info({
    context: "ListForm",
    list,
    profile,
    defaultValues: isCreating ? defaultValuesCreate : defaultValuesUpdate,
  });
  const methods = useForm<ListSchemaType>({
    defaultValues: isCreating ? defaultValuesCreate : defaultValuesUpdate,
    mode: "onBlur",
    resolver: isCreating ? zodResolver(ListSchema) : zodResolver(ListSchemaUpdate),
  });
  const formState = methods.formState;
  const errors = formState.errors;

  async function submitForm(formData: ListSchemaType) {

    logger.info({
      context: "ListForm.submitForm",
      formData
    });

    try {

      logger.info({
        context: "ListForm.submitForm",
        formData,
        isCreating,
      });

      setIsSaving(true);
      if (isCreating) {
        await createList(formData);
      } else {
        await updateList(list.id, formData as ListSchemaUpdateType);
      }
      setIsSaving(false);
      setResult(null);
      toast.success(`List "${formData.name}" was successfully ${isCreating ? "created" : "updated"}`);
      router.push("/lists");

    } catch (error) {

      setIsSaving(false);
      logger.info({
        message: "Error creating or updating List",
        error
      });
      setResult(error instanceof Error ? error : `${error}`);

    }
  }

  return (
    <div className={"card bg-base-300 shadow-xl"}>
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
