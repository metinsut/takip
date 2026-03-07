import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Ad en az 2 karakter olmalı.")
      .max(80, "Ad en fazla 80 karakter olabilir."),
    email: z.email("Geçerli bir e-posta adresi gir."),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı.")
      .max(128, "Şifre en fazla 128 karakter olabilir."),
    confirmPassword: z.string().min(1, "Şifre tekrar alanı zorunludur."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
