import { cn } from "@/lib/utils";

const INBOX_ITEMS = [
  {
    title: "Satış - Sözleşme revizyonu",
    status: "Beklemede",
    statusClass: "bg-amber-100 text-amber-700",
    description: "Müşteri hukuk onayı bekliyor. Son aksiyon: 2 saat önce gönderildi.",
  },
  {
    title: "Ürün - Kritik bug bildirimi",
    status: "Acil",
    statusClass: "bg-rose-100 text-rose-700",
    description: "Kullanıcı kaybı riski yüksek. Önerilen aksiyon: 30 dk içinde yanıt.",
  },
  {
    title: "Finans - Fatura teyidi",
    status: "Tamamlandı",
    statusClass: "bg-emerald-100 text-emerald-700",
    description: "Yanıtlandı ve dosyalandı. Ek işlem gerekmiyor.",
  },
] as const;

export function LandingInboxPreview() {
  return (
    <div className="animate-in fade-in zoom-in-95 delay-150 duration-700">
      <div className="rounded-3xl border border-border/80 bg-card/85 p-5 shadow-xl backdrop-blur sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Live Inbox</p>
            <p className="text-sm font-semibold">Durum Özeti</p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            AI Aktif
          </span>
        </div>

        <div className="space-y-3">
          {INBOX_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/70 bg-background/90 p-3"
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{item.title}</p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    item.statusClass,
                  )}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
