import { PlusIcon } from "@phosphor-icons/react";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Toolbar() {
  const { activeProjectId } = useLoaderData({ from: "__root__" });
  const navigate = useNavigate();

  const projectId = activeProjectId ? activeProjectId.toString() : undefined;

  const handleAddTask = () => {
    navigate({
      to: "/app/task/$taskId",
      params: { taskId: "add" },
      search: { projectId },
    });
  };

  return (
    <div className="flex justify-end">
      <Button onClick={handleAddTask}>
        <PlusIcon />
        Görev Ekle
      </Button>
    </div>
  );
}
