import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, AlertCircle, User, Clock } from "lucide-react";
import axios from "axios";
import { getApiUrl } from "@/const";

export default function IncidentsTab() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [children, setChildren] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    child_id: 0,
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
  });

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem("ong-gestor-pro-token");
      const res = await axios.get(`${getApiUrl()}/api/children/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChildren(res.data);
    } catch (e) {
      console.error("Erro ao carregar crianças", e);
    }
  };

  const fetchIncidents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("ong-gestor-pro-token");
      const res = await axios.get(`${getApiUrl()}/api/incidents/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncidents(res.data);
    } catch (e) {
      console.error("Erro ao carregar incidentes", e);
      toast.error("Erro ao carregar a lista de incidentes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchChildren(), fetchIncidents()]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("ong-gestor-pro-token");

      // Formata a data para o padrão esperado pelo Go (RFC3339)
      const payload = {
        ...formData,
        date: formData.date ? `${formData.date}T00:00:00Z` : new Date().toISOString(),
      };

      if (editingId) {
        await axios.put(`${getApiUrl()}/api/incidents/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Ocorrido atualizado com sucesso!");
      } else {
        await axios.post(`${getApiUrl()}/api/incidents/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Ocorrido registrado com sucesso!");
      }
      setOpen(false);
      setEditingId(null);
      setFormData({ child_id: 0, title: "", description: "", date: new Date().toISOString().split('T')[0] });
      await fetchIncidents();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erro ao salvar ocorrido");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (incidentId: number) => {
    if (!confirm("Tem certeza que deseja remover este ocorrido?")) return;
    try {
      const token = localStorage.getItem("ong-gestor-pro-token");
      await axios.delete(`${getApiUrl()}/api/incidents/${incidentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Ocorrido removido com sucesso!");
      await fetchIncidents();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erro ao remover ocorrido");
    }
  };

  const handleEdit = (incident: any) => {
    setEditingId(incident.id);
    setFormData({
      child_id: incident.child_id,
      title: incident.title,
      description: incident.description,
      date: incident.date ? incident.date.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Ocorridos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Registre eventos e incidentes
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({ child_id: 0, title: "", description: "", date: new Date().toISOString().split('T')[0] });
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Ocorrido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Ocorrido" : "Registrar Novo Ocorrido"}
              </DialogTitle>
              <DialogDescription>
                Descreva o evento ou incidente
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Criança</label>
                <Select
                  value={formData.child_id?.toString() || ""}
                  onValueChange={(value) => setFormData({...formData, child_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma criança" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((child: any) => (
                      <SelectItem key={child.id} value={child.id.toString()}>
                        {child.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Título</label>
                <Input
                  placeholder="Ex: Queda no pátio, Febre, etc."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Data</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  placeholder="Descreva o ocorrido em detalhes"
                  className="min-h-32"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSaving}
              >
                {isSaving ? <><Spinner className="w-4 h-4 mr-2" /> Salvando...</> : "Salvar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {incidents && incidents.length > 0 ? (
          incidents.map((incident: any) => (
            <Card key={incident.id} className="hover:shadow-md transition-shadow border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg mt-1">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{incident.title}</CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <User className="w-4 h-4" />
                        {incident.child?.name || `Criança ID ${incident.child_id}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(incident)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(incident.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <Clock className="w-4 h-4" />
                  {incident.date ? new Date(incident.date).toLocaleString("pt-BR") : "Data não informada"}
                </div>
                <p className="text-slate-900 dark:text-white leading-relaxed">
                  {incident.description}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Nenhum ocorrido registrado</p>
          </Card>
        )}
      </div>
    </div>
  );
}
