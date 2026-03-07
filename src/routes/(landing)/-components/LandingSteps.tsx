import { ChartBarIcon, SparkleIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    title: "Projeni aç veya içe aktar",
    description:
      "Sıfırdan başlayın ya da dağınık görevleri tek alana toplayın. İlk görünüm saatler değil, dakikalar içinde hazır olur.",
  },
  {
    title: "AI dağınıklığı temizlesin",
    description:
      "Notları, teslimleri ve bloke durumlarını ayrıştırır; öncelik, sahip ve sıradaki en mantıklı adımı önerir.",
  },
  {
    title: "Takım aynı ritimde ilerlesin",
    description:
      "Günlük özet, risk sinyali ve haftalık recap otomatik aktığı için herkes aynı resmi güncel görür.",
  },
] as const;

const AUTOMATIONS = [
  "Sabah özeti 09:00",
  "Bloke durumda risk alarmı",
  "Cuma recap otomatiği",
] as const;

export function LandingSteps() {
  return (
    <section
      id="workflow"
      className="mt-16 rounded-[2rem] border border-border/80 bg-linear-to-r from-card via-card to-muted/50 p-6 sm:p-8 lg:mt-20 lg:p-10"
    >
      <div className="flex flex-col gap-6">
        <div className="flex max-w-2xl flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ChartBarIcon size={16} className="text-primary" />3 adımda hızlı bir ekip ritmi kurun
          </div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Güncelleme toplamak yerine işi ilerleten bir akış.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Takip, kurulumdan günlük takibe kadar süreci basit tutar. Yapılacak işleri yazarsınız;
            kalan netliği AI ve ortak panel birlikte sağlar.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-background/85 p-5 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant="outline">0{index + 1}</Badge>
                <SparkleIcon size={18} className="text-primary" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-base font-medium text-foreground">{step.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-3xl border border-border/70 bg-background/75 p-5 backdrop-blur">
          <p className="text-sm font-medium text-foreground">AI otomasyonları ritmi korur</p>
          <div className="flex flex-wrap gap-2">
            {AUTOMATIONS.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
