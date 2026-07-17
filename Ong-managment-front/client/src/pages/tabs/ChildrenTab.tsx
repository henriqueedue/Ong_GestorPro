import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Clock, User } from "lucide-react";
import axios from "axios";
import { getApiUrl } from "@/const";

export default function ChildrenTab() {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    gender: "",
    notes: ""
  });

  const fetchChildren = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("ong-gestor-pro-token");
      const res = await axios.get(`${getApiUrl()}/api/children/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChildren(res.data);
    } catch (error: any) {
      console.error("Erro ao carregar crianças:", error);
      toast.error("Erro ao carregar lista de crianças.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleEditClick = (child: any) => {
    setEditingChild(child);
    setFormData({
      name: child.name,
      birth_date: child.birth_date ? child.birth_date.split('T')[0] : "",
      gender: child.gender,
      notes: child.notes || ""
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("ong-gestor-pro-token");
      const payload = {
        name: formData.name,
        birth_date: formData.birth_date ? `${formData.birth_date}T00:00:00Z` : "",
        gender: formData.gender,
        notes: formData.notes
      };

      if (editingChild) {
        await axios.put(`${getApiUrl()}/api/children/${editingChild.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Criança atualizada com sucesso!");
      } else {
        await axios.post(`${getApiUrl()}/api/children/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Criança cadastrada com sucesso!");
      }
      setOpen(false);
      setEditingChild(null);
      setFormData({ name: "", birth_date: "", gender: "", notes: "" });
      await fetchChildren();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erro ao salvar criança");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover esta criança?")) return;
    try {
      const token = localStorage.getItem("ong-gestor-pro-token");
      await axios.delete(`${getApiUrl()}/api/children/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Criança removida com sucesso!");
      await fetchChildren();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erro ao remover criança");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Crianças Cadastradas
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie as informações das crianças registradas.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      ) : children && children.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {children.map((child: any) => (
            <Card key={child.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{child.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {child.birth_date ? new Date(child.birth_date).toLocaleDateString("pt-BR") : "Data não informada"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(child)} className="p-2 h-8 w-8">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(child.id)} className="p-2 h-8 w-8 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium">Gênero:</span>
                  <span>{child.gender || "Não informado"}</span>
                </div>
                {child.notes && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      "{child.notes}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center gap-2">
            <User className="w-12 h-12 text-slate-400" />
            <p className="text-slate-600 dark:text-slate-400">Nenhuma criança encontrada.</p>
          </div>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingChild ? "Editar Criança" : "Cadastrar Criança"}</DialogTitle>
            <DialogDescription>
              Preencha os dados da criança abaixo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Nome Completo</label>
              <Input
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Data de Nascimento</label>
              <Input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Gênero</label>
              <Input
                placeholder="Ex: Masculino"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Observações</label>
              <Textarea
                placeholder="Alguma observação importante..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Dados"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
