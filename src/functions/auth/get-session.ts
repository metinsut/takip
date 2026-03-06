import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth/auth";

export const getSessionQueryKey = "session-query-key";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequest().headers;
  const session = await auth.api.getSession({ headers });
  return session || null;
});

export function useGetSession() {
  return queryOptions({
    queryKey: [getSessionQueryKey],
    queryFn: () => getSession(),
  });
}
