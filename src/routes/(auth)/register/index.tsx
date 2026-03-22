import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LandingBackground } from "@/routes/(landing)/-components";
import { RegisterForm } from "./-components/RegisterForm";

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterRoot,
});

function RegisterRoot() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <LandingBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-start justify-center px-3 py-3 sm:items-center sm:px-8 lg:py-8">
        <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700">
          <CardHeader>
            <div className="mb-8 flex items-center justify-center gap-2">
              <img src="/mailer.png" alt="Mail Pulse" className="h-12 w-auto object-contain" />
            </div>
            <CardTitle>Yeni hesap oluştur</CardTitle>
            <CardDescription>
              Mail analizleri ve otomatik aksiyon takibi için hemen başla.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <RegisterForm />
          </CardContent>

          <CardFooter className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>Zaten hesabın var mı?</p>
            <Link
              to="/login"
              className={cn(buttonVariants({ variant: "link" }), "h-auto px-0 text-xs")}
            >
              Giriş yap
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
