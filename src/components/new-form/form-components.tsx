import { CheckCircleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useFormContext } from ".";

type SubmitButtonProps = Omit<React.ComponentProps<typeof Button>, "children" | "type"> & {
  children: React.ReactNode;
  pendingChildren?: React.ReactNode;
  requireDirty?: boolean;
  icon?: React.ReactNode;
};

export function SubmitButton(props: SubmitButtonProps) {
  const {
    children,
    pendingChildren,
    requireDirty = true,
    disabled,
    icon = <CheckCircleIcon />,
    ...buttonProps
  } = props;
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty] as const}
      children={([canSubmit, isSubmitting, isDirty]) => (
        <Button
          type="submit"
          disabled={Boolean(disabled || !canSubmit || isSubmitting || (requireDirty && !isDirty))}
          {...buttonProps}
        >
          {isSubmitting ? <Spinner /> : icon}
          {isSubmitting ? (pendingChildren ?? children) : children}
        </Button>
      )}
    />
  );
}
