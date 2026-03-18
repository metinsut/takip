import { CalendarBlankIcon } from "@phosphor-icons/react";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dateFormat } from "@/helpers/date-format";
import { Button } from "../ui/button";
import { useFieldContext } from ".";
import { isFieldInvalid } from "./field-helpers";

type Props = {
  label: string;
  description?: string;
  placeholder?: string;
  displayFormat?: string;
};

export function DateForm(props: Props) {
  const { label, description, placeholder = "Tarih seç" } = props;
  const field = useFieldContext<Date>();
  const isInvalid = isFieldInvalid(field);

  const selectedDate = field.state.value;

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
              className="max-w-xs justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
            />
          }
        >
          <CalendarBlankIcon data-icon="inline-start" />
          {selectedDate ? (
            dayjs(selectedDate).format(dateFormat.DATE_FORMAT)
          ) : (
            <span>{placeholder}</span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              field.handleChange(date);
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
