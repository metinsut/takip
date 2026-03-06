import { SignOutIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import authClient from "@/lib/auth/auth-client";
import { m } from "@/paraglide/messages";

export function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(m.logOutSuccess());
      navigate({ to: "/" });
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      <SignOutIcon />
      {m.logOut()}
    </DropdownMenuItem>
  );
}
