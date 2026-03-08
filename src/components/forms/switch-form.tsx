import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { FieldContent } from "../ui/field";
import { Switch } from "../ui/switch";

export type FieldType = {
  name: string;
  state: {
    value: boolean | undefined;
    meta: {
      isTouched: boolean;
      isValid: boolean;
      errors: Array<{ message?: string } | undefined>;
    };
  };
  handleBlur: () => void;
  handleChange: (value: boolean) => void;
};

export type SwitchFormProps = {
  field: FieldType;
  label: string;
  description?: string;
};

export function SwitchForm(props: SwitchFormProps) {
  const { field, label, description } = props;

  return (
    <Field orientation="horizontal" className="max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
      <Switch
        id={field.name}
        checked={Boolean(field.state.value)}
        onCheckedChange={field.handleChange}
      />
    </Field>
  );
}
