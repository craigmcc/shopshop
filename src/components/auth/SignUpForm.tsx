"use client";

// @/components/auth/SignUpForm.tsx

/**
 * Form for the Sign Up page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { doSignUpAction } from "@/actions/authActions";
import { InputField } from "@/components/daisyui/InputField";
import { logger } from "@/lib/ClientLogger";
import {signUpSchema, signUpSchemaType} from "@/zod-schemas/signUpSchema";

// Public Objects ------------------------------------------------------------

export function SignUpForm() {

  const router = useRouter();
  const [isSaving, setisSaving] = useState<boolean>(false);

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

    try {

      setisSaving(true);
      const profile = await doSignUpAction(formData);
      setisSaving(false);
      logger.info({
        context: "SignUpForm.submitForm.success",
        profile: {
          email: profile.email,
          name: profile.name,
        }
      });
      toast(`Profile for '${profile.name}' was successfully created`, {
        type: "success",
      });
      router.push("/");

    } catch (error) {

      setisSaving(false);
      logger.info({
        context: "SignUpForm.submitForm.error",
        error: error,
      });
      const message = error instanceof Error ? error.message : `${error}`;
      toast(message, {
        type: "error",
      });

    }
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">Sign Up for ShopShop</h2>
        <FormProvider {...methods}>
          <form className="flex flex-row gap-2" onSubmit={methods.handleSubmit(submitForm)}>
            <div className="flex flex-col w-full gap-2">
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
            <div className=" flex flex-col w-full gap-2">
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
                {isSaving ? (
                  <>
                    <LoaderCircle className="animate-spin"/>Saving
                  </>
                ) : "Sign Up"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )

}
