import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LANDING_FEATURES } from "./landing-features";

export function LandingFeatures() {
  return (
    <section id="features" className="mt-16 flex flex-col gap-6 lg:mt-20">
      <div className="max-w-2xl flex flex-col gap-3">
        <p className="text-sm font-medium text-primary">Proje yönetimi, gerektiği kadar güçlü</p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Basit kalırken eksik bırakmayan bir çalışma ritmi.
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Takip sadece görev yazmanıza yardım etmez. Bağlamı toplar, kritik değişimleri öne çıkarır
          ve takımın hangi kararı neden vereceğini daha hızlı görmesini sağlar.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {LANDING_FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              size="sm"
              className="animate-in fade-in slide-in-from-bottom-4 h-full duration-500"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <CardHeader>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Badge variant="outline">{feature.label}</Badge>
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={18} />
                  </div>
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/75">{feature.footnote}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
