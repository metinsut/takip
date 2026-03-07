import { BrainIcon, KanbanIcon, LightningIcon, UsersThreeIcon } from "@phosphor-icons/react";

export const LANDING_FEATURES = [
  {
    icon: KanbanIcon,
    label: "Tek görünüm",
    title: "Dağılmayan proje akışı",
    description:
      "Görev, backlog, not ve kararlar ayrı araçlara bölünmeden aynı çalışma alanında kalır.",
    footnote: "Yeni bir sistem öğretmeden, ekibi hızlı şekilde aynı ritme sokar.",
  },
  {
    icon: BrainIcon,
    label: "AI destek",
    title: "Toplantı yerine net özet",
    description:
      "AI; günlük standup, değişen öncelik ve teslim risklerini tek bakışta anlaşılır hale getirir.",
    footnote: "Sabah nereden başlanacağı tartışılmaz, doğrudan uygulanır.",
  },
  {
    icon: LightningIcon,
    label: "Hız odağı",
    title: "Kararı bekletmeyen görünürlük",
    description:
      "Kim birini bekliyor, hangi iş blokta, hangi görev gecikiyor gibi sinyalleri erken gösterir.",
    footnote: "Takım fazla rapor yazmadan bile operasyon ritmi korunur.",
  },
  {
    icon: UsersThreeIcon,
    label: "Takım hızı",
    title: "Herkes aynı resmi görür",
    description:
      "Ürün, operasyon ve kurucu ekibi aynı veri üzerinden ilerler; bağlam kaybı ve tekrar azalır.",
    footnote: "Durum güncellemesi değil, paylaşılan netlik oluşur.",
  },
] as const;
