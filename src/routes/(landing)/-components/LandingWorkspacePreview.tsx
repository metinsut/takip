import { ArrowClockwiseIcon } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const OVERVIEW = [
  { label: "Bu hafta", value: "18 iş", detail: "Teslime yakın" },
  { label: "Bloke", value: "2 konu", detail: "Erken sinyal açık" },
  { label: "AI özeti", value: "41 sn", detail: "Son güncelleme" },
] as const;

const PRIORITIES = [
  {
    title: "Checkout akışındaki gereksiz adımları kaldır",
    owner: "Product",
    detail: "Bugün yayına alınacak değişiklik",
    status: "Yolda",
    variant: "default",
  },
  {
    title: "Referral landing tasarımını onaya gönder",
    owner: "Design",
    detail: "Onay gecikirse test takvimi kayacak",
    status: "Riskli",
    variant: "destructive",
  },
  {
    title: "Satış demo checklist'ini paylaş",
    owner: "Ops",
    detail: "Müşteri sunumu için tüm ekip hazır",
    status: "Hazır",
    variant: "secondary",
  },
] as const;

const AI_NOTES = [
  "Tasarım onayı bugün çıkmazsa sprint çıktılarından biri bir sonraki haftaya sarkıyor.",
  "Checklist görevi hazır durumda; demo öncesi doğrudan müşteri ekibine aktarılabilir.",
  "İki görev aynı bağlama sahip. Tek owner altında toplarsanız bir gün kazanırsınız.",
] as const;

const TIMELINE = [
  { day: "Pzt", progress: "w-8" },
  { day: "Sal", progress: "w-12" },
  { day: "Car", progress: "w-16" },
  { day: "Per", progress: "w-10" },
  { day: "Cum", progress: "w-14" },
] as const;

export function LandingWorkspacePreview() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 delay-150">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className="w-fit">
              AI plan aktif
            </Badge>
            <CardTitle>Growth Sprint / Mart</CardTitle>
            <CardDescription>
              Hedef, öncelik ve riskler tek çalışma alanında görünür.
            </CardDescription>
          </div>
          <CardAction>
            <AvatarGroup>
              <Avatar size="sm">
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarFallback>EA</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarFallback>SU</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+4</AvatarGroupCount>
            </AvatarGroup>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {OVERVIEW.map((item) => (
              <div key={item.label} className="rounded-2xl bg-muted p-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">Bugünün öncelikleri</p>
                <Badge variant="secondary">Canlı güncel</Badge>
              </div>
              <div className="flex flex-col gap-3">
                {PRIORITIES.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.detail}</p>
                      </div>
                      <Badge variant={item.variant}>{item.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{item.owner}</Badge>
                      <span>Sahip atandı</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-background/75 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">AI öneriyor</p>
                <Badge>Sonraki adım</Badge>
              </div>
              <div className="flex flex-col gap-3">
                {AI_NOTES.map((note) => (
                  <div
                    key={note}
                    className="rounded-2xl bg-muted p-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {note}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-foreground">Haftalık tempo</p>
                <div className="grid gap-2">
                  {TIMELINE.map((item) => (
                    <div key={item.day} className="grid grid-cols-[2.2rem_1fr] items-center gap-3">
                      <span className="text-xs text-muted-foreground">{item.day}</span>
                      <div className="h-2 rounded-full bg-muted">
                        <div className={`h-2 rounded-full bg-primary ${item.progress}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <ArrowClockwiseIcon size={16} className="text-primary" />
            Son AI güncellemesi 41 saniye önce
          </div>
          <Badge variant="outline">Takım senkronize</Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
