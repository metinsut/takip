import { PlusIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Toolbar() {
  const navigate = useNavigate();

  const handleAddTask = () => {
    navigate({
      to: "/app/task/$taskId",
      params: { taskId: "add" },
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
