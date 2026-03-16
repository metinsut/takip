import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from ".";
import { getFieldErrors, isFieldInvalid } from "./field-helpers";

type SharedFieldProps = {
  label: string;
  description?: string;
};

type InputFieldProps = SharedFieldProps & {
  placeholder?: string;
  inputProps?: Omit<
    React.ComponentProps<typeof Input>,
    "aria-invalid" | "id" | "name" | "onBlur" | "onChange" | "value"
  >;
};

type TextareaFieldProps = SharedFieldProps & {
  placeholder?: string;
  textareaProps?: Omit<
    React.ComponentProps<typeof Textarea>,
    "aria-invalid" | "id" | "name" | "onBlur" | "onChange" | "value"
  >;
};

export type SelectFieldOption<TValue extends string = string> = {
  label: string;
  value: TValue;
  disabled?: boolean;
};

type SelectFieldProps<TValue extends string = string> = SharedFieldProps & {
  options: SelectFieldOption<TValue>[];
  placeholder?: string;
  emptyValue?: TValue;
  triggerProps?: Omit<
    React.ComponentProps<typeof SelectTrigger>,
    "aria-invalid" | "children" | "className" | "id" | "name" | "onBlur"
  >;
};

type SwitchFieldProps = SharedFieldProps & {
  switchProps?: Omit<
    React.ComponentProps<typeof Switch>,
    "checked" | "id" | "onBlur" | "onCheckedChange"
  >;
};

export function InputField(props: InputFieldProps) {
  const { label, description, placeholder, inputProps } = props;
  const field = useFieldContext<string | undefined>();
  const isInvalid = isFieldInvalid(field);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        {...inputProps}
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        aria-invalid={isInvalid || undefined}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        placeholder={placeholder}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid ? <FieldError errors={getFieldErrors(field)} /> : null}
    </Field>
  );
}

export function TextareaField(props: TextareaFieldProps) {
  const { label, description, placeholder, textareaProps } = props;
  const field = useFieldContext<string | undefined>();
  const isInvalid = isFieldInvalid(field);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        {...textareaProps}
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        aria-invalid={isInvalid || undefined}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        placeholder={placeholder}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid ? <FieldError errors={getFieldErrors(field)} /> : null}
    </Field>
  );
}

export function SelectField<TValue extends string = string>(props: SelectFieldProps<TValue>) {
  const { label, description, options, placeholder, emptyValue, triggerProps } = props;
  const field = useFieldContext<TValue | undefined>();
  const isInvalid = isFieldInvalid(field);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        value={field.state.value ?? null}
        onValueChange={(value) => {
          if (value !== null) {
            field.handleChange(value as TValue);
            return;
          }

          if (emptyValue !== undefined) {
            field.handleChange(emptyValue);
          }
        }}
      >
        <SelectTrigger
          {...triggerProps}
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
      {isInvalid ? <FieldError errors={getFieldErrors(field)} /> : null}
    </Field>
  );
}

export function SwitchField(props: SwitchFieldProps) {
  const { label, description, switchProps } = props;
  const field = useFieldContext<boolean | undefined>();
  const isInvalid = isFieldInvalid(field);

  return (
    <Field orientation="horizontal" className="max-w-sm" data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        {isInvalid ? <FieldError errors={getFieldErrors(field)} /> : null}
      </FieldContent>
      <Switch
        {...switchProps}
        id={field.name}
        checked={Boolean(field.state.value)}
        onBlur={field.handleBlur}
        onCheckedChange={field.handleChange}
      />
    </Field>
  );
}
