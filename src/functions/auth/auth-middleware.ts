import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "@/functions/auth/get-session";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession();
  if (!session) {
    throw redirect({ to: "/" });
  }

  return await next();
});
