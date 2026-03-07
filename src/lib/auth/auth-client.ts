import { createAuthClient } from "better-auth/client";
import { adminClient, organizationClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
  plugins: [adminClient(), organizationClient()],
});

export default authClient;
