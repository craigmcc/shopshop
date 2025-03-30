"use client";

// @/components/auth/SignInForm.tsx

/**
 * Form for the Sign In page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { doSignInAction } from "@/actions/AuthActions";
import { ServerResult } from "@/components/shared/ServerResult";
import { useAppForm } from "@/components/tanstack-form/useAppForm";
import { ActionResult } from "@/lib/ActionResult";
import { logger } from "@/lib/ClientLogger"
import { SignInSchema, type SignInSchemaType } from "@/zod-schemas/SignInSchema";

// Public Objects ------------------------------------------------------------

export function SignInForm() {

  const [result, setResult] = useState<ActionResult<Profile> | null>(null);
  const router = useRouter();

  const defaultValues: SignInSchemaType = {
    email: "",
    password: "",
  }

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await submitForm(value);
    },
    validators: {
      onBlur: SignInSchema,
      onChange: SignInSchema,
    },
  });

  async function submitForm(formData: SignInSchemaType) {

    logger.trace({
      context: "SignInForm.submitForm.input",
      formData: {
        ...formData,
        password: "*REDACTED*",
      }
    });

    const result = await doSignInAction(formData);
    if (result.model) {

      logger.trace({
        context: "SignInForm.submitForm.success",
        email: formData.email,
      });
      setResult(null);
      toast.success("Welcome back to ShopShop!");
      router.push("/lists");

    } else {

      logger.trace({
        context: "SignInForm.submitForm.error",
        error: result.message,
      });
      setResult({ message: "Invalid email or password, please try again." });

    }

  }

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">
          <ServerResult result={result} />
        </h2>
        <form
          className="flex flex-col gap-2"
          name="SignInForm"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppField name="email">
            {(field) =>
              <field.InputField
                autoFocus
                label="Email"
                placeholder="Your email address"
              />}
          </form.AppField>
          <form.AppField name="password">
            {(field) =>
              <field.InputField
                label="Password"
                placeholder="Your Password"
                type="password"
              />}
          </form.AppField>
          <form.AppForm>
            <div className="flex flex-row justify-center">
              <form.SubmitButton/>
            </div>
          </form.AppForm>
        </form>
      </div>
    </div>
  )

}
