"use client";

// @/components/profiles/ProfileSettingsForm.tsx

/**
 * Form for editing Profiles.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { zodResolver } from "@hookform/resolvers/zod";
import { Profile } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { updateProfile } from "@/actions/ProfileActions";
import { InputField } from "@/components/daisyui/InputField";
import { ServerResult } from "@/components/shared/ServerResult";
import { ActionResult } from "@/lib/ActionResult";
import { logger } from "@/lib/ClientLogger";
import {
  ProfileUpdateSchema,
  type ProfileUpdateSchemaType
} from "@/zod-schemas/ProfileSchema";

const isTesting = process.env.NODE_ENV === "test";

// Public Objects ------------------------------------------------------------

type Props = {
  // Profile to be updated
  profile: Profile,
}

export function ProfileSettingsForm({ profile }: Props) {

  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [result, setResult] = useState<ActionResult<Profile> | null>(null);

  logger.trace({
    context: "ProfileSettingsForm",
    profile,
  });

  const defaultValuesUpdate: ProfileUpdateSchemaType = {
    email: profile.email,
    name: profile.name,
  }
  const methods = useForm<ProfileUpdateSchemaType>({
    defaultValues: defaultValuesUpdate,
    mode: "onBlur",
    resolver: zodResolver(ProfileUpdateSchema),
  });
  const formState = methods.formState;
  const errors = formState.errors;

  async function submitForm(formData: ProfileUpdateSchemaType): Promise<void> {

    logger.trace({
      context: "ProfileSettingsForm.submitForm.input",
      formData,
    })

    setIsSaving(true);
    const response = await updateProfile(profile.id, formData);
    setIsSaving(false);

    logger.trace({
      context: "ProfileSettingsForm.submitForm.output",
      response,
    });

    if (response.model) {
      setResult(null);
      toast.success(`Profile '${formData.name}' was successfully updated`);
      // Work around testing issue with mock router
      if (isTesting) {
        setResult({message: "Success"});
      } else {
        router.push("/");
      }
    } else {
      setResult(response);
    }

  }

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">
          <ServerResult result={result} />
          <div>Update Profile</div>
        </h2>
        <FormProvider {...methods}>
          <form
            className="flex flex-col w-full"
            name="ProfileSettingsForm"
            onSubmit={methods.handleSubmit(submitForm)}
          >
            <div className="gap-4">
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
              <button
                className="btn btn-primary"
                disabled={Object.keys(errors).length > 0}
                type="submit"
              >
                {isSaving ? (
                  <>
                    <LoaderCircle className="animate-spin"/>Saving
                  </>
                ) : "Save"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );

}
