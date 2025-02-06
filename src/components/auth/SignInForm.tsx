"use client";

// @/components/auth/SignInForm.tsx

/**
 * Form for the Sign In page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { doSignInAction } from "@/actions/AuthActions";
import { InputField } from "@/components/daisyui/InputField";
import { logger } from "@/lib/ClientLogger"
import { SignInSchema, type SignInSchemaType } from "@/zod-schemas/SignInSchema";

// Public Objects ------------------------------------------------------------

export function SignInForm() {

  const router = useRouter();

  const defaultValues: SignInSchemaType = {
    email: "",
    password: "",
  }
  const methods = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(SignInSchema),
  });
  const formState = methods.formState;
  const errors = formState.errors;

  async function submitForm(formData: SignInSchemaType) {
    logger.info({
      context: "SignInForm.submitForm",
      formData: {
        ...formData,
        password: "*REDACTED*",
      }
    });
    try {
      await doSignInAction(formData);
      logger.info({
        context: "SignInForm.submitForm.success",
        email: formData.email,
      })
      toast.success("Welcome back to ShopShop!");
      router.push("/lists");
    } catch (error) {
      logger.error({
        context: "SignInForm.submitForm.error",
        email: formData.email,
        error: error,
      });
      const message = error instanceof Error ? error.message : `${error}`;
      toast.error(message);
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">Sign In to ShopShop</h2>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(submitForm)} className="flex flex-col gap-2">
              <InputField
                autoFocus
                label="Email"
                name="email"
                placeholder="Your Email Address"
                type="email"
              />
              <InputField
                label="Password"
                name="password"
                placeholder="Your Password"
                type="password"
              />
              <button
                className="btn btn-primary"
                disabled={Object.keys(errors).length > 0}
                type="submit"
              >
                Sign In
              </button>
          </form>
        </FormProvider>
      </div>
    </div>
  )

}
