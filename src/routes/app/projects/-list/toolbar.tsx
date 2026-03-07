import { PlusIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

export function Toolbar() {
  return (
    <div className="flex justify-end">
      <Button
        nativeButton={false}
        render={
          <Link to="/app/projects/$projectId" params={{ projectId: "add" }}>
            <PlusIcon />
            {m.addProject()}
          </Link>
        }
      />
    </div>
  );
}
