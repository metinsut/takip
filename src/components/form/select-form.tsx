import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from ".";
import { isFieldInvalid } from "./field-helpers";

export type SelectOption = {
  label: string;
  value: string | null;
  disabled?: boolean;
};

type Props = {
  label: string;
  options: SelectOption[];
  placeholder: string;
  description?: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
};

export function SelectForm(props: Props) {
  const { label, description, placeholder, options, leftIcon, disabled, required } = props;
  const field = useFieldContext<string | null>();
  const isInvalid = isFieldInvalid(field);

  return (
    <Field data-invalid={isInvalid} data-disabled={disabled}>
      <FieldLabel htmlFor={field.name}>
        {label}
        {required && <span>*</span>}
      </FieldLabel>
      <Select value={field.state.value} onValueChange={field.handleChange} disabled={disabled}>
        <SelectTrigger
          id={field.name}
          name={field.name}
          className="w-full"
          aria-invalid={isInvalid}
        >
          <div className="flex items-center gap-2 w-full">
            {leftIcon}
            <SelectValue placeholder={placeholder} />
          </div>
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
