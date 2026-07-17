import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ChildrenTab() {
  const [children, setChildren] = useState([]); // Aqui viria seu useEffect que busca da API

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Lista de Crianças</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Criança
        </Button>
      </div>

      {/* Aqui você renderizará sua lista de crianças */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <p className="text-slate-500">Nenhuma criança cadastrada ainda.</p>
      </div>
    </div>
  );
}