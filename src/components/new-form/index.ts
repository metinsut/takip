import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import {
  InputField,
  SelectField,
  type SelectFieldOption,
  SwitchField,
  TextareaField,
} from "./field-components";
import { SubmitButton } from "./form-components";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm, withForm, withFieldGroup, useTypedAppFormContext } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
    TextareaField,
    SelectField,
    SwitchField,
  },
  formComponents: {
    SubmitButton,
  },
});

export type { SelectFieldOption };
export {
  fieldContext,
  formContext,
  useAppForm,
  useFieldContext,
  useFormContext,
  useTypedAppFormContext,
  withFieldGroup,
  withForm,
};
