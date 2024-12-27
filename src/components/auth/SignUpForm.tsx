// @/components/auth/SignUpForm.tsx

"use client"

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
import { useForm } from "react-hook-form";

// Internal Modules ----------------------------------------------------------

import { saveSignUpAction } from "@/actions/saveSignUpAction";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { DisplayServerActionResponse } from "@/components/shared/DisplayServerActionResponse";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
//  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/ClientLogger"
import { signUpSchema, type signUpSchemaType } from "@/zod-schemas/signUpSchema";

// Public Objects ------------------------------------------------------------

export default function SignUpForm() {

  const router = useRouter();
  const { toast } = useToast();

  const defaultValues: signUpSchemaType = {
    confirmPassword: "",
    email: "",
    name: "",
    password: "",
  }

  const form = useForm<signUpSchemaType>({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(signUpSchema),
  });

  const {
    execute: executeSave,
    isPending: isSaving,
    reset: resetSaveAction,
    result: saveResult,
  } = useAction(saveSignUpAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast({
          description: data.message,
          title: "Success! 🎉",
          variant: "default",
        });
      }
      router.push("/");
    },
    onError({ error }) {
      toast({
        description: "Incorrect credentials",
        title: "Error",
        variant: "destructive",
      });
      logger.error({
        context: "SignUpForm.onError",
        error: error,
      });
    }
  });

  async function submitForm(data: signUpSchemaType) {
    logger.info({
      context: "SignUpForm.submitForm",
      data: {
        ...data,
        confirmPassword: "*REDACTED*",
        password: "*REDACTED*",
      }
    });
    executeSave(data);
  }

  return (

    <Card className="items-center justify-center">

      <CardHeader>
        <CardTitle>Sign Up for ShopShop</CardTitle>
        <CardDescription>
          <DisplayServerActionResponse result={saveResult}/>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className={"flex flex-col gap-1 sm:px-8"}>

          <Form {...form}>
            <form
              className="flex flex-col md:flex-row gap-4 md:gap-8"
              onSubmit={form.handleSubmit(submitForm)}
            >
              <div className="flex flex-col gap-4 w-full max-w-xs">

                <InputWithLabel<signUpSchemaType>
                  autoFocus
                  fieldTitle="Email Address:"
                  nameInSchema="email"
                />

                <InputWithLabel<signUpSchemaType>
                  fieldTitle="Name:"
                  nameInSchema="name"
                />

              </div>

              <div className="flex flex-col gap-4 w-full max-w-xs">

                <InputWithLabel<signUpSchemaType>
                  fieldTitle="Password:"
                  nameInSchema="password"
                  type="password"
                />

                <InputWithLabel<signUpSchemaType>
                  fieldTitle="Confirm Password:"
                  nameInSchema="confirmPassword"
                  type="password"
                />

                <div className="flex gap-2">

                  <Button
                    className="w-3/4"
                    disabled={isSaving}
                    title="Save"
                    type="submit"
                    variant="default"
                  >
                    {isSaving ? (
                      <>
                        <LoaderCircle className="animate-spin"/> Saving
                      </>
                    ) : "Save"}
                  </Button>

                  <Button
                    onClick={() => {
                      form.reset(defaultValues)
                      resetSaveAction();
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
      </CardContent>

      {/*
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
      */}
    </Card>

  )
}
