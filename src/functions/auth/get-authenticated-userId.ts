import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth/auth";

export async function getAuthenticatedUserId() {
  const headers = getRequest().headers;
  const session = await auth.api.getSession({ headers });
  const userId = session?.user?.id;

  return userId;
}
