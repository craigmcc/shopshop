// @/components/forms/SignUpForm.tsx

"use client"

/**
 * Form for the Sign Up page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Internal Modules ----------------------------------------------------------

import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
//import { DisplayServerActionResponse } from "@/components/shared/DisplayServerActionResponse";
import { logger } from "@/lib/ClientLogger"
import { signUpSchema, type signUpSchemaType } from "@/zod-schemas/signUpSchema";

// Public Objects ------------------------------------------------------------

export default function SignUpForm() {

  const defaultValues: signUpSchemaType = {
    confirmPassword: "",
    email: "",
    name: "",
    password: "",
  }

  const form = useForm<signUpSchemaType>({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(signUpSchema),
  });

  // TODO: next-safe-action action declaration
  const isSaving = false; // TODO

  async function submitForm(data: signUpSchemaType) {
    // TODO: invoke action declaration
    logger.info({
      context: "SignUpForm.submitForm",
      data: data,
    });
  }

  return (
    <div className={"flex flex-col gap-1 sm:px-8"}>
      {/*<DisplayServerActionResponse result={saveResult} />*/}
      <div>
        <h2 className="text-2xl font-bold">
          Sign Up for ShopShop
        </h2>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col md:flex-row gap-4 md:gap-8"
          onSubmit={form.handleSubmit(submitForm)}
        >
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <InputWithLabel<signUpSchemaType>
              fieldTitle="Email Address:"
              nameInSchema="email"
            />
            <InputWithLabel<signUpSchemaType>
              fieldTitle="Name:"
              nameInSchema="name"
            />
            <InputWithLabel<signUpSchemaType>
              fieldTitle="Password:"
              nameInSchema="password"
              type="password"
            />
            <InputWithLabel<signUpSchemaType>
              fieldTitle="Confirm Password:"
              nameInSchema="confirmPassword"
              type="password"
            />
            <div className="flex gap-2">
              <Button
                className="w-3/4"
                disabled={isSaving}
                title="Save"
                type="submit"
                variant="default"
              >
                {isSaving ? (
                  <>
                    <LoaderCircle className="animate-spin"/> Saving
                  </>
                ) : "Save"}
              </Button>
              <Button
                onClick={() => {
                  form.reset(defaultValues)
                  // resetSaveAction()
                }}
                title="Reset"
                type="button"
                variant="destructive"
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>

  )
}
