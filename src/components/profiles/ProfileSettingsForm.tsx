"use client";

// @/components/profiles/ProfileSettingsForm.tsx

/**
 * Form for editing Profiles.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { updateProfile } from "@/actions/ProfileActions";
import { ServerResult } from "@/components/shared/ServerResult";
import { useAppForm } from "@/components/tanstack-form/useAppForm";
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

  const [result, setResult] = useState<ActionResult<Profile> | null>(null);
  const router = useRouter();

  const defaultValuesUpdate: ProfileUpdateSchemaType = {
    email: profile.email,
    name: profile.name,
  }

  const form = useAppForm({
    defaultValues: defaultValuesUpdate,
    onSubmit: async ({ value }) => {
      await submitForm(value);
    },
    validators: {
      onBlur: ProfileUpdateSchema,
      onChange: ProfileUpdateSchema,
    },
  })

  async function submitForm(formData: ProfileUpdateSchemaType): Promise<void> {

    logger.trace({
      context: "ProfileSettingsForm.submitForm.input",
      formData,
    })

    const response = await updateProfile(profile.id, formData);
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
        {result && (
          <h2 className="card-title justify-center">
            <ServerResult result={result} />
          </h2>
        )}
        <form
          className="flex flex-row gap-2"
          name="ProfileSettingsForm"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-2">
            <form.AppField name="name">
              {(field) =>
                <field.InputField
                  autoFocus
                  label="Name"
                  placeholder="Your Name"
                />}
            </form.AppField>
            <form.AppField name="email">
              {(field) =>
                <field.InputField
                  label="Email"
                  placeholder="Your email address"
                />}
            </form.AppField>
            <form.AppForm>
              <div className="flex flex-row justify-between">
                <form.ResetButton/>
                <form.SubmitButton/>
              </div>
            </form.AppForm>
          </div>
        </form>
      </div>
    </div>
  );

}
