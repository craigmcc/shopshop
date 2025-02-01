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
import { useAction } from "next-safe-action/hooks";
import { FormProvider, useForm } from "react-hook-form";

// Internal Modules ----------------------------------------------------------

import { saveSignUpAction } from "@/actions/authActions";
import { InputField } from "@/components/daisyui/InputField";
import { DisplayServerActionResponse } from "@/components/shared/DisplayServerActionResponse";
import { logger } from "@/lib/ClientLogger";
import {signUpSchema, signUpSchemaType} from "@/zod-schemas/signUpSchema";

// Public Objects ------------------------------------------------------------

export function SignUpForm() {

  const router = useRouter();

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

  const {
    execute: executeSave,
    isPending: isSaving,
//    reset: resetSaveAction,
    result: saveResult,
  } = useAction(saveSignUpAction, {

    onError({ error }) {
      // TODO - toast(error.message)?
      logger.error({
        context: "SignUpForm.onError",
        error: error.serverError,
      });
    },

    onSuccess({ data }) {
      if (data?.message) {
        // TODO - toast(data.message)?
        logger.info({
          context: "SignUpForm.onSuccess",
          message: data.message,
        })
      }
      router.push("/")
    }

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
    executeSave(formData);
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">Sign Up for ShopShop</h2>
        <DisplayServerActionResponse result={saveResult} />
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
                    <LoaderCircle className="animate-spin"/> Saving
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
