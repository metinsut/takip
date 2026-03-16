import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { InputForm } from "./input-form";
import { SelectForm } from "./select-form";
import { SubmitButton } from "./submit-button";
import { SwitchForm } from "./switch-form";
import { TextareaForm } from "./textarea-form";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm, withForm, withFieldGroup, useTypedAppFormContext } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputForm,
    TextareaForm,
    SelectForm,
    SwitchForm,
  },
  formComponents: {
    SubmitButton,
  },
});

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
