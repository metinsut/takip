import { GoogleLogoIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import authClient from "@/lib/auth/auth-client";

export function GoogleSignin() {
  async function handleLoginGoogle() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/app",
    });

    console.log(error);

    if (error) {
      toast.error(error.message ?? "Google bağlantısı başlatılamadı.");
      return;
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleLoginGoogle}>
      <GoogleLogoIcon />
      Google ile Login Ol
    </Button>
  );
}
