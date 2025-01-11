// @/components/lists/ListForm.tsx

"use client"

/**
 * Form for creating and editing Lists.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { Profile } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
//import {redirect} from "next/navigation";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";

// Internal Modules ----------------------------------------------------------

import { saveListAction } from "@/actions/listActions";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { DisplayServerActionResponse } from "@/components/shared/DisplayServerActionResponse";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/ClientLogger";
import { listSchema, type listSchemaType } from "@/zod-schemas/listSchema";

// Public Objects ------------------------------------------------------------

type Props = {
  list: listSchemaType,
  profile: Profile,
}

export default function ListForm({ list, profile }: Props ) {

  const defaultValues: listSchemaType = {
    id: list?.id ?? undefined,
    name: list?.name ?? "",
    profileId: list?.profileId ?? profile.id,
  }
  logger.trace({
    context: "ListForm",
    list,
    profile,
    defaultValues,
  });
  const form = useForm<listSchemaType>({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(listSchema)
  });
  const { toast } = useToast();

  const {
    isPending: isSaving,
    execute: executeSave,
    reset: resetListAction,
    result: saveResult,
  } = useAction(saveListAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast({
          description: data.message,
          title: "Success! 🎉",
          variant: "default",
        });
      }
//      redirect("/lists"); // TODO - doesn't work, may not be needed
    },
    onError({ error }) {
      logger.error({
        context: "ListForm.onError",
        error,
      })
      toast({
        description: "Save Failed",
        title: "Error",
        variant: "destructive",
      });
    },
  });

  async function submitForm(data: listSchemaType) {
    executeSave(data);
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <DisplayServerActionResponse result={saveResult}/>
      <Form {...form}>
        <form
          className="flex flex-col gap-4 w-full max-w-xs"
          onSubmit={form.handleSubmit(submitForm)}
        >
          <div className="flex flex-col gap-4 w-full max-w-ws">
            <InputWithLabel<listSchemaType>
              autoFocus
              fieldTitle="List Name:"
              nameInSchema="name"
            />
            <input id="id" type="hidden" value={list.id}/>
            <input id="profileId" type="hidden" value={list.profileId}/>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              className="w-3/4"
              variant="default"
              title="Save"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="animate-spin" /> Saving
                </>
              ) : "Save"}
            </Button>

            <Button
              type="button"
              variant="destructive"
              title="Reset"
              onClick={() => {
                form.reset(defaultValues);
                resetListAction();
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );

}
