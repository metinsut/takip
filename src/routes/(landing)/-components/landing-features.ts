import { ClockIcon, ShieldCheckIcon, SparkleIcon } from "@phosphor-icons/react";

export const LANDING_FEATURES = [
  {
    icon: SparkleIcon,
    title: "Akıllı Özet",
    description:
      "Her maili bağlamıyla birlikte tek satırda özetleyip kritik aksiyonları öne çıkarır.",
  },
  {
    icon: ClockIcon,
    title: "Durum Takibi",
    description:
      "Beklemede, yanıtlandı, acil gibi etiketlerle ekipte neyin nerede kaldığını görünür yapar.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Güvenli İşleyiş",
    description:
      "Hassas içerikler için güvenli analiz akışı ile sadece gereken kişilere bilgi paylaşır.",
  },
] as const;
