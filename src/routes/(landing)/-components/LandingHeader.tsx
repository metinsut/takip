import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  return (
    <header className="mb-10 flex items-center justify-between">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
        <img src="/mailer2.png" alt="Side Project 2026" className="h-10 object-contain" />
      </Link>
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            "h-9 rounded-xl px-4 text-sm",
          )}
        >
          Giriş
        </Link>
        <Link
          to="/register"
          className={cn(buttonVariants({ size: "lg" }), "h-9 rounded-xl px-4 text-sm")}
        >
          Kayıt Ol
        </Link>
      </div>
    </header>
  );
}
