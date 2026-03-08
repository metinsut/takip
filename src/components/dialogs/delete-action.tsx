"use client";

import { TrashIcon, WarningCircleIcon } from "@phosphor-icons/react";
import type { ReactElement } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void | Promise<void>;
  title?: string;
  description?: string;
  isLoading?: boolean;
  className?: string;
};

function DeleteDialogContent(props: DeleteDialogProps) {
  const { onDelete, title, description, isLoading, className } = props;

  return (
    <AlertDialogContent className={cn("sm:max-w-md", className)}>
      <AlertDialogHeader className="gap-2">
        <AlertDialogMedia>
          <WarningCircleIcon className="text-destructive" />
        </AlertDialogMedia>
        <AlertDialogTitle>{title ?? m.areYouSureDeleteTitle()}</AlertDialogTitle>
        <AlertDialogDescription>
          {description ?? m.areYouSureDeleteDescription()}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading} variant="ghost" size="lg">
          {m.cancel()}
        </AlertDialogCancel>
        <AlertDialogAction
          type="button"
          variant="destructive"
          size="lg"
          onClick={() => void onDelete()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <TrashIcon data-icon="inline-start" />
          )}
          {m.confirmDelete()}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

type DeleteTriggerProps = {
  buttonProps?: ButtonProps;
};

function DeleteTrigger(props: DeleteTriggerProps) {
  const { buttonProps } = props;

  return (
    <AlertDialogTrigger
      render={
        <Button
          type="button"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          size="icon-sm"
          aria-label={m.delete()}
          {...buttonProps}
        />
      }
    >
      <TrashIcon data-icon="inline-start" />
    </AlertDialogTrigger>
  );
}

type DeleteActionProps = DeleteDialogProps & {
  trigger?: ReactElement;
  buttonProps?: ButtonProps;
};

export function DeleteAction(props: DeleteActionProps) {
  const { open, onOpenChange, trigger, buttonProps, ...contentProps } = props;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger ? (
        <AlertDialogTrigger render={trigger} />
      ) : (
        <DeleteTrigger buttonProps={buttonProps} />
      )}
      <DeleteDialogContent open={open} onOpenChange={onOpenChange} {...contentProps} />
    </AlertDialog>
  );
}

export function DeleteDialog(props: DeleteDialogProps) {
  const { open, onOpenChange, ...contentProps } = props;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <DeleteDialogContent open={open} onOpenChange={onOpenChange} {...contentProps} />
    </AlertDialog>
  );
}
