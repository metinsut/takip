import {
  ArrowRightIcon,
  BrainIcon,
  LightningIcon,
  SparkleIcon,
  TargetIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HERO_SIGNALS = [
  {
    icon: LightningIcon,
    title: "10 dakikada kurulum",
    description: "Aracı anlatmak için değil, işi ilerletmek için açarsınız.",
  },
  {
    icon: TargetIcon,
    title: "Tek ekranda netlik",
    description: "Öncelik, bloke iş ve sorumlu kişi aynı yerde kalır.",
  },
  {
    icon: BrainIcon,
    title: "AI günlük özet",
    description: "Standup, risk ve sonraki adım her sabah hazır olur.",
  },
] as const;

export function LandingHero() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 flex flex-col gap-6 duration-700">
      <div className="flex max-w-2xl flex-col gap-4">
        <h1 className="max-w-2xl text-balance text-4xl leading-tight font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Basit, hızlı ve sade bir proje yönetimi.
        </h1>
        <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Takip; görevleri, sprintleri ve ekip notlarını tek yerde toplar. Kimin neye odaklandığı,
          neyin bloke olduğu ve sıradaki en doğru hamle saniyeler içinde görünür hale gelir.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/register" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
          Ücretsiz Başla
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
        <Link
          to="/login"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
        >
          Panele Giriş Yap
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {HERO_SIGNALS.map((signal) => {
          const Icon = signal.icon;
          return (
            <div
              key={signal.title}
              className="rounded-3xl border border-border/80 bg-card/85 p-4 backdrop-blur"
            >
              <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-foreground">{signal.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {signal.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
          <SparkleIcon size={16} className="text-primary" />
          Günlük standup özeti
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
          <BrainIcon size={16} className="text-primary" />
          Akıllı önceliklendirme
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
          <TargetIcon size={16} className="text-primary" />
          Teslim risklerini erken gör
        </div>
      </div>
    </div>
  );
}
