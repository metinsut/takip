import type { ReactNode } from "react";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

type Props = {
  icon: ReactNode;
  label: string;
  name: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  type: "text" | "email" | "password";
  value: string;
  isInvalid: boolean;
  errors: Array<{ message?: string } | undefined>;
  autoComplete?: string;
};

export function RegisterInputField(props: Props) {
  const {
    icon,
    label,
    name,
    onBlur,
    onChange,
    placeholder,
    type,
    value,
    isInvalid,
    errors,
    autoComplete,
  } = props;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <FieldContent>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>{icon}</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id={name}
            name={name}
            type={type}
            autoComplete={autoComplete}
            value={value}
            onBlur={onBlur}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-invalid={isInvalid}
          />
        </InputGroup>
        <FieldError errors={errors} />
      </FieldContent>
    </Field>
  );
}
