"use client"

// @/components/auth/SignInForm.tsx

/**
 * Form for the Sign In page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
//import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

// Internal Modules ----------------------------------------------------------

import { InputField } from "@/components/daisyui/InputField";
//import { MessageBox } from "@/components/shared/MessageBox";
import { logger } from "@/lib/ClientLogger"
import { signInSchema, type signInSchemaType } from "@/zod-schemas/signInSchema";

// Public Objects ------------------------------------------------------------

export function SignInForm() {

//  const [result, setResult] = useState<MessageBoxProps | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  //  const { toast } = useToast();

  const defaultValues: signInSchemaType = {
    email: "",
    password: "",
  }
  const methods = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(signInSchema),
  });
  const formState = methods.formState;
  const errors = formState.errors;

  async function submitForm(formData: signInSchemaType) {
    logger.info({
      context: "SignInForm.submitForm",
      formData: {
        ...formData,
        password: "*REDACTED*",
      }
    });
    // TODO - actually submit the form
  }

  /*
    async function performSignIn(formData: signInSchemaType) {
      try {
        const response = await doSignIn(formData);
        logger.info({
          context: "SignInForm.performSignIn.output",
          response: response,
        });
        setResult({content: "Successful sign in", type: "success"})
        router.push("/lists");
      } catch (e) {
        logger.info({
          context: "SignInForm.performSignIn.error",
          error: e,
        });
        if ((e instanceof CredentialsSignin)) {
          setResult({content: "Invalid Credentials (CSI)", type: "error"});
        } else if (e instanceof Error) {
          setResult({ content: e.message.split(".")[0], type: "error" });
        } else {
          setResult({content: "Unknown error occurred", type: "error" });
        }
      }
  }
  */

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">Sign In to ShopShop</h2>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(submitForm)}>
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
