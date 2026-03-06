import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { db } from "@/db";
import { account as accountSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "./get-authenticated-userId";

export const getAccountQueryKey = "account-query-key";

export const getAccount = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    toast.error("user id not found");
    return;
  }

  const [account] = await db
    .select()
    .from(accountSchema)
    .where(eq(accountSchema.userId, userId))
    .limit(1);
  return account || null;
});

export function useGetAccount() {
  return queryOptions({
    queryKey: [getAccountQueryKey],
    queryFn: () => getAccount(),
  });
}
