import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { FieldContent } from "../ui/field";
import { Switch } from "../ui/switch";
import { useFieldContext } from ".";
import { isFieldInvalid } from "./field-helpers";

type Props = {
  label: string;
  description?: string;
};

export function SwitchForm(props: Props) {
  const { label, description } = props;
  const field = useFieldContext<boolean | undefined>();
  const isInvalid = isFieldInvalid(field);

  return (
    <Field orientation="horizontal" data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
      <Switch
        id={field.name}
        checked={Boolean(field.state.value)}
        onCheckedChange={field.handleChange}
        aria-invalid={isInvalid}
      />
    </Field>
  );
}
