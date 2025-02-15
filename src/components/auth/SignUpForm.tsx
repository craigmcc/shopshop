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

import { createProfile } from "@/actions/ProfileActions";
import { InputField } from "@/components/daisyui/InputField";
import { ServerResponse} from "@/components/shared/ServerResponse";
import { logger } from "@/lib/ClientLogger";
import {SignUpSchema, SignUpSchemaType} from "@/zod-schemas/SignUpSchema";

// Public Objects ------------------------------------------------------------

export function SignUpForm() {

  const router = useRouter();
  const [isSaving, setisSaving] = useState<boolean>(false);
  const [result, setResult] = useState<string | Error | null>(null);

  const defaultValues: SignUpSchemaType = {
    confirmPassword: "",
    email: "",
    name: "",
    password: "",
  }
  const methods = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(SignUpSchema),
  });
  const formState = methods.formState;
  const errors = formState.errors;

  async function submitForm(formData: SignUpSchemaType) {

    logger.trace({
      context: "SignUpForm.submitForm",
      formData: {
        ...formData,
        confirmPassword: "*REDACTED*",
        password:"*REDACTED*",
      }
    });

    try {

      setisSaving(true);
//      const profile = await doSignUpAction(formData);
      const profile = await createProfile(formData);
      setisSaving(false);
      logger.trace({
        context: "SignUpForm.submitForm.success",
        profile: {
          email: profile.email,
          name: profile.name,
        }
      });
      toast.success(`Profile for '${profile.name}' was successfully created`);
      router.push("/");

    } catch (error) {

      setisSaving(false);
      logger.trace({
        context: "SignUpForm.submitForm.error",
        error: error,
      });
      const message = error instanceof Error ? error.message : `${error}`;
      setResult(error instanceof Error ? error : message);

    }

  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">Sign Up for ShopShop</h2>
        {result && <ServerResponse result={result} />}
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
