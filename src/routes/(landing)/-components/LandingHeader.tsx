import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  return (
    <header className="mb-12 flex items-center justify-between gap-4">
      <Link to="/" className="inline-flex items-center gap-3 text-foreground">
        <img src="/takip.png" alt="Takip" className="h-20 w-auto object-contain" />
      </Link>
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "hidden sm:inline-flex")}
        >
          Giriş
        </Link>
        <Link to="/register" className={buttonVariants({ size: "lg" })}>
          Kayıt Ol
        </Link>
      </div>
    </header>
  );
}
