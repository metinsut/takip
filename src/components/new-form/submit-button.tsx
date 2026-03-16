import { CheckCircleIcon } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useFormContext } from ".";

type Props = {
  label: string;
};

export function SubmitButton(props: Props) {
  const { label } = props;
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}>
      {([canSubmit, isSubmitting, isDirty]) => (
        <Button type="submit" disabled={!canSubmit || isSubmitting || !isDirty}>
          {isSubmitting ? <Spinner /> : <CheckCircleIcon />}
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
