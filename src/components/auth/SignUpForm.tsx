"use client";

// @/components/auth/SignUpForm.tsx

/**
 * Form for the Sign Up page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { signUpProfile } from "@/actions/ProfileActions";
import { ServerResult } from "@/components/shared/ServerResult";
import { useAppForm } from "@/components/tanstack-form/useAppForm";
import { ActionResult } from "@/lib/ActionResult";
import { logger } from "@/lib/ClientLogger";
import { SignUpSchema, type SignUpSchemaType } from "@/zod-schemas/SignUpSchema";

// Public Objects ------------------------------------------------------------

export function SignUpForm() {

  const [result, setResult] = useState<ActionResult<Profile> | null>(null);
  const router = useRouter();

  const defaultValues: SignUpSchemaType = {
    confirmPassword: "",
    email: "",
    name: "",
    password: "",
  }

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await submitForm(value);
    },
    validators: {
      onBlur: SignUpSchema,
      onChange: SignUpSchema,
    },
  });

  async function submitForm(formData: SignUpSchemaType) {

    logger.trace({
      context: "SignUpForm.submitForm.input",
      formData: {
        ...formData,
        confirmPassword: "*REDACTED*",
        password:"*REDACTED*",
      }
    });

    const response = await signUpProfile(formData);
    if (response.model) {
      setResult(null);
      toast.success(`Profile for '${formData.name}' was successfully created`);
      router.push("/");
    } else {
      setResult(response);
    }

  }

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">
          <ServerResult result={result} />
        </h2>
        <form
          className="flex flex-row gap-2"
          name="SignUpForm"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col 2-full gap-2">
            <form.AppField name="name">
              {(field) =>
                <field.InputField
                  autoFocus
                  label="Name"
                  placeholder="Your Name"
                />}
            </form.AppField>
            <form.AppField name="email">
              {(field) =>
                <field.InputField
                  label="Email"
                  placeholder="Your email address"
                />}
            </form.AppField>
          </div>
          <div className="flex flex-col 2-full gap-2">
            <form.AppField name="password">
              {(field) =>
                <field.InputField
                  label="Password"
                  placeholder="Your Password"
                  type="password"
                />}
            </form.AppField>
            <form.AppField name="confirmPassword">
              {(field) =>
                <field.InputField
                  label="Confirm Password"
                  placeholder="Confirm Your Password"
                  type="password"
                />}
            </form.AppField>
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
  )

}
