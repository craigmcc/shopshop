// @/types/types.d.ts

/**
 * Generic types common to this entire application.
 *
 * @packageDocumentation
 */

// Public Types --------------------------------------------------------------

/**
 * The options for a select field.
 */
export type SelectOption = {
  // The label of the option.
  label: string;
  // The value of the option. By convention, a value of "" is used
  // to mark an option as disabled, and not selectable. This is handy
  // if you need a "placeholder" like option at the top of the list.
  value: string;
}
