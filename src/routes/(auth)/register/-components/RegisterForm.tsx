import { LockKeyIcon, MailboxIcon, UserIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import authClient from "@/lib/auth/auth-client";
import { RegisterInputField } from "./RegisterInputField";
import { type RegisterFormValues, registerSchema } from "./register-schema";

export function RegisterForm() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as RegisterFormValues,
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);

      const { error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      });

      if (error) {
        setSubmitError(error.message ?? "Kayıt oluşturulamadı. Lütfen tekrar dene.");
        return;
      }

      await navigate({ to: "/app/home" });
    },
  });

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        validators={{
          onBlur: registerSchema.shape.name,
        }}
      >
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          const errors = field.state.meta.errors;

          return (
            <RegisterInputField
              name={field.name}
              label="Ad Soyad"
              type="text"
              placeholder="Ad Soyad"
              icon={<UserIcon />}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              isInvalid={isInvalid}
              errors={errors}
              autoComplete="name"
            />
          );
        }}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onBlur: registerSchema.shape.email,
        }}
      >
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          const errors = field.state.meta.errors;

          return (
            <RegisterInputField
              name={field.name}
              label="E-posta"
              type="email"
              placeholder="ornek@company.com"
              icon={<MailboxIcon />}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              isInvalid={isInvalid}
              errors={errors}
              autoComplete="email"
            />
          );
        }}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onBlur: registerSchema.shape.password,
        }}
      >
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          const errors = field.state.meta.errors;

          return (
            <RegisterInputField
              name={field.name}
              label="Şifre"
              type="password"
              placeholder="********"
              icon={<LockKeyIcon />}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              isInvalid={isInvalid}
              errors={errors}
              autoComplete="new-password"
            />
          );
        }}
      </form.Field>

      <form.Field
        name="confirmPassword"
        validators={{
          onBlur: registerSchema.shape.confirmPassword,
        }}
      >
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          const errors = field.state.meta.errors;

          return (
            <RegisterInputField
              name={field.name}
              label="Şifre Tekrar"
              type="password"
              placeholder="********"
              icon={<LockKeyIcon />}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              isInvalid={isInvalid}
              errors={errors}
              autoComplete="new-password"
            />
          );
        }}
      </form.Field>

      {submitError ? (
        <Alert variant="destructive">
          <WarningCircleIcon />
          <AlertTitle>Kayıt başarısız</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" size="lg" className="w-full" disabled={!canSubmit || isSubmitting}>
            {isSubmitting && <Spinner />}
            Hesap Oluştur
          </Button>
        )}
      />
    </form>
  );
}
