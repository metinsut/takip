import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingClosingCta() {
  return (
    <section className="mt-16 lg:mt-20">
      <div className="rounded-[2rem] border border-border/80 bg-linear-to-r from-card via-card to-muted/60 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl flex flex-col gap-3">
            <Badge variant="outline" className="w-fit">
              Takip ile ritmi koru
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Görevleri dağıtmayın. Takımla birlikte tek panelde ilerleyin.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Basit bir proje yönetim alanı, hızlı karar verecek kadar net görünürlük ve AI ile
              gelen günlük özet. Takip tam olarak bu denge için tasarlandı.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
              Çalışma alanını oluştur
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
            <Link
              to="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
            >
              Mevcut hesabımla giriş yap
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5">
            <SparkleIcon size={16} className="text-primary" />
            AI standup ve haftalık recap
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5">
            <SparkleIcon size={16} className="text-primary" />
            Tek ekranda risk ve teslim takibi
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5">
            <SparkleIcon size={16} className="text-primary" />
            Küçük ekiple yüksek ritim
          </div>
        </div>
      </div>
    </section>
  );
}
