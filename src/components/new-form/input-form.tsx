import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useFieldContext } from ".";
import { isFieldInvalid } from "./field-helpers";

type Props = {
  label: string;
  description?: string;
  placeholder?: string;
};

export function InputForm(props: Props) {
  const { label, description, placeholder, ...rest } = props;
  const field = useFieldContext<string>();
  const isInvalid = isFieldInvalid(field);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        {...rest}
        id={field.name}
        name={field.name}
        value={field.state.value}
        aria-invalid={isInvalid}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        placeholder={placeholder}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}
