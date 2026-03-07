import { LockKeyIcon, MailboxIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import authClient from "@/lib/auth/auth-client";
import { type LoginFormValues, loginSchema } from "./login-schema";

export function LoginForm() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true as boolean,
    } as LoginFormValues,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);

      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });

      if (error) {
        setSubmitError(error.message ?? "Giriş yapılamadı. Lütfen bilgilerini tekrar kontrol et.");
        return;
      }

      await navigate({ to: "/app" });
    },
  });

  return (
    <form
      id="login-form"
      noValidate
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="email"
          validators={{
            onBlur: loginSchema.shape.email,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            const errors = field.state.meta.errors;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>E-posta</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>
                      <MailboxIcon />
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="ornek@company.com"
                    aria-invalid={isInvalid}
                  />
                </InputGroup>
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onBlur: loginSchema.shape.password,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            const errors = field.state.meta.errors;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Şifre</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>
                      <LockKeyIcon />
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    type="password"
                    autoComplete="current-password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="********"
                    aria-invalid={isInvalid}
                  />
                </InputGroup>
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" size="lg" className="w-full" disabled={!canSubmit || isSubmitting}>
            {isSubmitting && <Spinner />}
            Giriş Yap
          </Button>
        )}
      />
      {submitError ? (
        <Alert variant="destructive">
          <WarningCircleIcon />
          <AlertTitle>Giriş başarısız</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  );
}
