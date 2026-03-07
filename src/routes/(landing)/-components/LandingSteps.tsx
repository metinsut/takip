import { ChartBarIcon } from "@phosphor-icons/react";

const STEPS = [
  "Mailbox bağla, kuralları tanımla, segmentleri belirle.",
  "AI mail içeriklerini öncelik, duygu ve aksiyona göre sınıflandırsın.",
  "Tek ekranda durumları izle, kritik işleri otomatik bildirime al.",
] as const;

export function LandingSteps() {
  return (
    <section className="mt-14 rounded-3xl border border-border/70 bg-linear-to-r from-card via-card/90 to-muted/40 p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <ChartBarIcon className="size-4 text-primary" />3 adımda canlı operasyon görünürlüğü
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {STEPS.map((text, index) => (
          <div key={text} className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <p className="mb-2 text-xs font-semibold text-primary">0{index + 1}</p>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
