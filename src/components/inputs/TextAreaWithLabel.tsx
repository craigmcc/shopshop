"use client"

/**
 * RHF input field for a textarea with a label.
 *
 * @packageDocumentation
 */

import { TextareaHTMLAttributes } from "react"
import { useFormContext } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from "@/components/ui/textarea"

type Props<S> = {     // S = (Zod) Schema
  fieldTitle: string,
  nameInSchema: keyof S & string,
  className?: string,
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextAreaWithLabel<S>({
                                       fieldTitle, nameInSchema, className, ...props
                                     }: Props<S>) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className="text-base mb-2"
            htmlFor={nameInSchema}
          >
            {fieldTitle}
          </FormLabel>

          <FormControl>
            <Textarea
              id={nameInSchema}
              className={`disabled:text-blue-500 dark:disabled:text-yellow-300 disabled:opacity-75
               ${className}`}
              {...props}
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}