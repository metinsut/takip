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
import { GoogleSignin } from "./-components/google-signin";
import { LoginForm } from "./-components/login-form";

export const Route = createFileRoute("/(auth)/login/")({
  component: Login,
});

type LoginProps = Record<string, never>;

export function Login(_props: LoginProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <LandingBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-start sm:items-center justify-center px-3 py-3 sm:px-8 lg:py-8">
        <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700">
          <CardHeader>
            <div className="mb-2 flex items-center gap-2 justify-center">
              <img src="/takip.png" alt="Takip" className="h-20 w-auto object-contain" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Hesabına giriş yap
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <LoginForm />
            <GoogleSignin />
          </CardContent>

          <CardFooter className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>Hesabın yok mu?</p>
            <Link
              to="/register"
              className={cn(buttonVariants({ variant: "link" }), "h-auto px-0 text-xs")}
            >
              Yeni hesap oluştur
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
