import { ArrowRightIcon, BrainIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATS = [
  { value: "12s", label: "Ortalama analiz süresi" },
  { value: "%96", label: "Durum tespit doğruluğu" },
  { value: "7/24", label: "Kesintisiz izleme" },
] as const;

export function LandingHero() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
        <BrainIcon className="size-3.5 text-primary" />
        AI destekli mailbox kontrol merkezi
      </p>
      <h1 className="max-w-xl text-balance text-xl lg:text-4xl leading-tight font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-tight">
        Mailleri tarar, <span className="text-primary">durumu net çıkarır</span>, ekibine hazır
        aksiyon listesi verir.
      </h1>
      <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
        Mail Pulse, yüzlerce maili saniyeler içinde analiz eder; hangi iş bekliyor, kimden yanıt
        bekleniyor, hangisi kritik seviyede gibi sorulara tek panelde cevap verir.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          to="/register"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 rounded-xl px-5 text-sm font-semibold",
          )}
        >
          Ücretsiz Başla
          <ArrowRightIcon className="size-4" />
        </Link>
        <Link
          to="/login"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 rounded-xl border-border/80 bg-background/90 px-5 text-sm",
          )}
        >
          Panele Giriş Yap
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/70 bg-card/80 p-4 backdrop-blur"
          >
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
