import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export type FieldType = {
  name: string;
  state: {
    value: string | null | undefined;
    meta: {
      isTouched: boolean;
      isValid: boolean;
      errors: Array<{ message?: string } | undefined>;
    };
  };
  handleBlur: () => void;
  handleChange: (value: string) => void;
};

type TextareaFormProps = {
  field: FieldType;
  label: string;
  placeholder: string;
  description?: string;
};

export function TextareaForm(props: TextareaFormProps) {
  const { field, label, placeholder, description } = props;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        placeholder={placeholder}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}
