// @/components/auth/SignUpForm.tsx

"use client"

/**
 * Form for the Sign Up page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

// Internal Modules ----------------------------------------------------------

import { InputField } from "@/components/daisyui/InputField";
import { logger } from "@/lib/ClientLogger";
import {signUpSchema, signUpSchemaType} from "@/zod-schemas/signUpSchema";

// Public Objects ------------------------------------------------------------

export function SignUpForm() {

  const defaultValues: signUpSchemaType = {
    confirmPassword: "",
    email: "",
    name: "",
    password: "",
  }
  const methods = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(signUpSchema),
  });
  const formState = methods.formState;
  const errors = formState.errors;
  logger.info({
    context: "SignUpForm.errors",
    errors
  });

  async function submitForm(formData: signUpSchemaType) {
    logger.info({
      context: "SignUpForm.submitForm",
      formData: {
        ...formData,
        confirmPassword: "*REDACTED*",
        password:"*REDACTED*",
      }
    });
    // TODO - actually submit the form
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">Sign Up for ShopShop</h2>
        <FormProvider {...methods}>
          <form className="flex flex-row gap-2" onSubmit={methods.handleSubmit(submitForm)}>
            <div className="w-full">
              <InputField
                autoFocus
                label="Name"
                name="name"
                placeholder="Your Name"
                type="text"
              />
              <InputField
                label="Email"
                name="email"
                placeholder="Your Email Address"
                type="email"
              />
            </div>
            <div className="w-full">
              <InputField
                label="Password"
                name="password"
                placeholder="Your Password"
                type="password"
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm Your Password"
                type="password"
              />
              <button
                className="btn btn-primary"
                disabled={Object.keys(errors).length > 0}
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )

}
