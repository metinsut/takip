import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";

export const Route = createFileRoute("/app/examples/")({
  component: ExamplesPage,
});

function ExamplesPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">UI Örnekleri</h1>
        <p className="text-muted-foreground text-sm">
          Input, Switch, Checkbox, Radio, Textarea, Select ve ilgili bileşenlerin kullanım
          örnekleri.
        </p>
      </div>

      <Separator />

      {/* Input */}
      <Section title="Input" description="Metin girişi bileşenleri">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Input örnekleri</CardTitle>
            <CardDescription>Card içinde label ve açıklama ile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel>Ad Soyad</FieldLabel>
              <FieldDescription>Tam adınızı girin.</FieldDescription>
              <Input placeholder="Ad Soyad" />
            </Field>
            <Field>
              <FieldLabel>Şifre</FieldLabel>
              <Input
                type="password"
                placeholder="••••••••"
                data-invalid={true}
                aria-invalid={true}
              />
            </Field>
          </CardContent>
        </Card>
      </Section>

      <Separator />

      {/* Switch */}
      <Section title="Switch" description="Açık/kapalı anahtar">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Ayarlar</CardTitle>
            <CardDescription>Tercihlerinizi yönetin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field orientation="horizontal">
              <FieldLabel>E-posta bildirimleri</FieldLabel>
              <FieldDescription>Yeni mesajlarda e-posta al.</FieldDescription>
              <Switch defaultChecked />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel>Push bildirimleri</FieldLabel>
              <Switch />
            </Field>
          </CardContent>
        </Card>
      </Section>

      <Separator />

      {/* Checkbox */}
      <Section title="Checkbox" description="Çoklu seçim kutusu">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Tercihler</CardTitle>
            <CardDescription>İletişim tercihlerinizi seçin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field orientation="horizontal">
              <Checkbox id="cb-card-1" />
              <FieldLabel htmlFor="cb-card-1">E-posta ile bilgilendir</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="cb-card-2" defaultChecked />
              <FieldLabel htmlFor="cb-card-2">SMS bildirimleri</FieldLabel>
            </Field>
          </CardContent>
        </Card>
      </Section>

      <Separator />

      {/* Radio */}
      <Section title="Radio Group" description="Tekil seçim">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Sipariş tipi</CardTitle>
            <CardDescription>Teslimat veya mağazadan al.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="teslimat">
              <Field orientation="horizontal">
                <RadioGroupItem value="teslimat" id="r-card-1" />
                <FieldLabel htmlFor="r-card-1">Teslimat</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="magaza" id="r-card-2" />
                <FieldLabel htmlFor="r-card-2">Mağazadan al</FieldLabel>
              </Field>
            </RadioGroup>
          </CardContent>
        </Card>
      </Section>

      <Separator />

      {/* Textarea */}
      <Section title="Textarea" description="Çok satırlı metin">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Geri bildirim</CardTitle>
            <CardDescription>Görüşlerinizi paylaşın.</CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel>Yorum</FieldLabel>
              <Textarea placeholder="Deneyiminizi yazın..." rows={4} />
            </Field>
          </CardContent>
        </Card>
      </Section>

      <Separator />

      {/* Select */}
      <Section title="Select" description="Açılır liste">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Bölge</CardTitle>
            <CardDescription>Teslimat bölgesi seçin.</CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel>Bölge</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Bölge seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marmara">Marmara</SelectItem>
                  <SelectItem value="ege">Ege</SelectItem>
                  <SelectItem value="akdeniz">Akdeniz</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>
      </Section>

      <Separator />

      {/* InputGroup */}
      <Section title="Input Group" description="Addon’lı input">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Alan adı</CardTitle>
            <CardDescription>Ön ek ve domain.</CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel>Domain</FieldLabel>
              <InputGroup>
                <InputGroupAddon>www.</InputGroupAddon>
                <InputGroupInput placeholder="sitem" />
                <InputGroupAddon align="inline-end">.com</InputGroupAddon>
              </InputGroup>
            </Field>
          </CardContent>
        </Card>
      </Section>

      <Separator />

      {/* Toggle */}
      <Section title="Toggle" description="Basılı tutma butonu">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Metin stilleri</CardTitle>
            <CardDescription>Editörde kullanılacak stiller.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Toggle>Kalın</Toggle>
              <Toggle variant="outline">İtalik</Toggle>
              <Toggle variant="outline">Alt çizgi</Toggle>
            </div>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}

type SectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function Section(props: SectionProps) {
  const { title, description, children } = props;
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children}
    </section>
  );
}
