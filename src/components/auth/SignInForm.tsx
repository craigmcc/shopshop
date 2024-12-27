// @/components/auth/SignInForm.tsx

"use client"

/**
 * Form for the Sign In page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Internal Modules ----------------------------------------------------------

import { doSignIn } from "@/actions/authActions";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import MessageBox, { MessageBoxProps } from "@/components/shared/MessageBox";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { logger } from "@/lib/ClientLogger"
import { signInSchema, type signInSchemaType } from "@/zod-schemas/signInSchema";
import {CredentialsSignin} from "next-auth";

// Public Objects ------------------------------------------------------------

export default function SignInForm() {

  const [result, setResult] = useState<MessageBoxProps | null>(null);

  const router = useRouter();
  //  const { toast } = useToast();

  const defaultValues: signInSchemaType = {
    email: "",
    password: "",
  }

  const form = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(signInSchema),
  });

  async function performSignIn(formData: signInSchemaType) {
    try {
      const response = await doSignIn(formData);
      logger.info({
        context: "SignInForm.performSignIn.output",
        response: response,
      });
      setResult({content: "Successful sign in", type: "success"})
      router.push("/"); // TODO - probably go to lists page when it exists
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

/*
  async function submitForm(formData: signInSchemaType) {
    try {
      const response = await doSignIn(formData);
      logger.info({
        context: "SignInForm.submitForm.output",
        response: response,
      });
      redirect("/"); // TODO - probably go to lists page when it exists
    } catch (error) {
      logger.info({
        context: "SignInForm.submitForm.error",
        error: error,
      })
      alert("Incorrect credentials");
    }

  }
*/

  return (
    <div className={"flex flex-col gap-1 sm:px-8"}>
      { result && (
        <MessageBox content={result.content} type={result.type}/>
      )}
      <div>
        <h2 className="text-2xl font-bold">
          Sign In To ShopShop
        </h2>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col md:flex-row gap-4 md:gap-8"
          onSubmit={form.handleSubmit(performSignIn)}
        >
          <div className="flex flex-col gap-4 w-full max-w-xs">

            <InputWithLabel<signInSchemaType>
              autoFocus
              fieldTitle="Email Address:"
              nameInSchema="email"
            />

            <InputWithLabel<signInSchemaType>
              fieldTitle="Password:"
              nameInSchema="password"
              type="password"
            />

            <div className="flex gap-2">

              <Button
                className="w-3/4"
                // disabled={isSaving}
                title="Sign In"
                type="submit"
                variant="default"
              >
                  Sign In
              </Button>

              <Button
                onClick={() => {
                  form.reset(defaultValues)
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
