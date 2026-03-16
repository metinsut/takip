import type { AnyFieldApi } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectOption<TValue extends string = string> = {
  label: string;
  value: TValue;
  disabled?: boolean;
};

type SelectFormProps = {
  field: AnyFieldApi;
  label: string;
  options: SelectOption[];
  placeholder: string;
  description?: string;
  emptyValue?: string;
};

export function SelectForm(props: SelectFormProps) {
  const { field, label, options, placeholder, description, emptyValue } = props;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        value={field.state.value ?? null}
        onValueChange={(value) => {
          if (value !== null) {
            field.handleChange(value);
            return;
          }

          if (emptyValue !== undefined) {
            field.handleChange(emptyValue);
          }
        }}
      >
        <SelectTrigger
          id={field.name}
          name={field.name}
          className="w-full"
          aria-invalid={isInvalid || undefined}
          onBlur={field.handleBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}
