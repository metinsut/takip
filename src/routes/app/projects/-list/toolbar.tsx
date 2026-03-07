import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

export function Toolbar() {
  return (
    <div className="flex justify-end">
      <Button>
        <PlusIcon />
        {m.addProject()}
      </Button>
    </div>
  );
}
