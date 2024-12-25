// @/components/forms/SignInForm.tsx

"use client"

/**
 * Form for the Sign In page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
//import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
//import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";

// Internal Modules ----------------------------------------------------------

import { doSignIn, /*doSignOut,*/ /*saveSignInAction*/ } from "@/actions/saveSignInAction";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
//import { DisplayServerActionResponse } from "@/components/shared/DisplayServerActionResponse";
//import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/ClientLogger"
import { signInSchema, type signInSchemaType } from "@/zod-schemas/signInSchema";

// Public Objects ------------------------------------------------------------

export default function SignInForm() {

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

/*
  const {
    execute: executeSave,
    isPending: isSaving,
    reset: resetSaveAction,
    result: saveResult,
  } = useAction(saveSignInAction, {
      onSuccess({ data }) {
        if (data?.message) {
          toast({
            description: data.message,
            title: "Success! 🎉",
            variant: "default",
          });
        }
        router.push("/"); // TODO - probably needs to go to table of lists
      },
    onError({ error }) {
      toast({
        description: "Login Failed",
        title: "Error",
        variant: "destructive",
      });
      logger.error({
        context: "SignInForm.onError",
        error: error,
      });
    },
  });
*/

  async function submitForm(formData: signInSchemaType) {
    logger.info({
      context: "SignInForm.submitForm",
      formData: {
        ...formData,
        password: "*REDACTED*",
      }
    });
    const response = await doSignIn(formData);
//    executeSave(data);
    if (!!response.error) {
      // Display local error???
    } else {
      router.push("/");  // TODO - to lists page?
    }

  }

  return (
    <div className={"flex flex-col gap-1 sm:px-8"}>
      {/*<DisplayServerActionResponse result={saveResult} />*/}
      <div>
        <h2 className="text-2xl font-bold">
          Sign In To ShopShop
        </h2>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col md:flex-row gap-4 md:gap-8"
          onSubmit={form.handleSubmit(submitForm)}
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
{/*
                {isSaving ? (
                  <>
                    <LoaderCircle className="animate-spin"/> Signing In
                  </>
                ) :
*/}
                  Sign In
{/*
                }
*/}
              </Button>

              <Button
                onClick={() => {
                  form.reset(defaultValues)
//                  resetSaveAction();
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
