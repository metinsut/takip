import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth/auth";

export const getUserQueryKey = "user-query-key";

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequest().headers;
  const session = await auth.api.getSession({ headers });
  return session?.user || null;
});

export function useGetUser() {
  return queryOptions({
    queryKey: [getUserQueryKey],
    queryFn: () => getUser(),
  });
}
