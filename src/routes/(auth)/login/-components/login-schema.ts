import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Geçerli bir e-posta adresi gir."),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalı.")
    .max(128, "Şifre en fazla 128 karakter olabilir."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
