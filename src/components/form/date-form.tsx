import { CalendarBlankIcon } from "@phosphor-icons/react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFieldContext } from ".";
import { isFieldInvalid } from "./field-helpers";

type Props = {
  label: string;
  description?: string;
  placeholder?: string;
  displayFormat?: string;
};

const defaultValueFormat = "YYYY-MM-DD";
const defaultDisplayFormat = "DD.MM.YYYY";

export function DateForm(props: Props) {
  const {
    label,
    description,
    placeholder = "Tarih seç",
    displayFormat = defaultDisplayFormat,
  } = props;
  const field = useFieldContext<string | null | undefined>();
  const isInvalid = isFieldInvalid(field);

  const parsedDate = field.state.value ? dayjs(field.state.value) : null;
  const selectedDate = parsedDate?.isValid() ? parsedDate.toDate() : undefined;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id={field.name}
              variant="outline"
              data-empty={!selectedDate}
              aria-invalid={isInvalid}
              onBlur={field.handleBlur}
              className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
            />
          }
        >
          <CalendarBlankIcon data-icon="inline-start" />
          {selectedDate ? dayjs(selectedDate).format(displayFormat) : <span>{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              field.handleChange(date ? dayjs(date).format(defaultValueFormat) : "");
              field.handleBlur();
            }}
          />
        </PopoverContent>
      </Popover>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}
