import type { AnyFieldApi } from "@tanstack/react-form";

// type FieldErrorMessage = {
//   message?: string;
// };

// function normalizeFieldError(error: unknown): FieldErrorMessage[] {
//   if (Array.isArray(error)) {
//     return error.flatMap(normalizeFieldError);
//   }

//   if (typeof error === "string") {
//     return [{ message: error }];
//   }

//   if (
//     error &&
//     typeof error === "object" &&
//     "message" in error &&
//     typeof error.message === "string"
//   ) {
//     return [{ message: error.message }];
//   }

//   return [];
// }

// export function getFieldErrors(field: AnyFieldApi): FieldErrorMessage[] {
//   return field.state.meta.errors.flatMap(normalizeFieldError);
// }

export function isFieldInvalid(field: AnyFieldApi) {
  return field.state.meta.isTouched && !field.state.meta.isValid;
}
