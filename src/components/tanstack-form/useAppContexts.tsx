"use client";

// @/components/tanstack-form/useFieldContext.tsx

/**
 * Contexts and hooks for TanStack Form fields and forms.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { createFormHookContexts } from "@tanstack/react-form";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Export useFieldContext and related objects for use in custom components.
 */

export const { fieldContext, formContext, useFieldContext, useFormContext }
  = createFormHookContexts();
