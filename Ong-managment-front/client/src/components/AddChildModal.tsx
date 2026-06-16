import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export function AddChildModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    gender: "",
    notes: ""
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tenta obter o token. Se o seu sistema usa "auth_token", mantenha assim.
    const token = localStorage.getItem("token") || localStorage.getItem("auth_token");

    if (!token) {
      alert("Sessão não encontrada. Por favor, faça login novamente.");
      return;
    }

    setIsLoading(true);

    try {
      // O payload deve ter as chaves IGUAIS às tags json da sua struct Go
      const payload = {
        name: formData.name,
        birth_date: formData.birth_date,
        gender: formData.gender,
        notes: formData.notes
      };

      await axios.post(`${API_URL}/api/children/`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      setFormData({ name: "", birth_date: "", gender: "", notes: "" });
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erro na requisição:", error);
      // Exibe a mensagem real enviada pelo servidor para te ajudar a corrigir o erro 400
      const msg = error.response?.data?.message || error.response?.data?.error || "Erro ao conectar ao servidor.";
      alert("Erro ao cadastrar: " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="w-4 h-4 mr-2" /> Nova Criança</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Criança</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para registrar uma nova criança no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            placeholder="Nome Completo" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <Input 
            type="date" 
            value={formData.birth_date}
            onChange={(e) => setFormData({...formData, birth_date: e.target.value})} 
            required 
          />
          <Input 
            placeholder="Gênero (ex: Feminino/Masculino)" 
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})} 
          />
          <Textarea 
            placeholder="Observações médicas ou notas..." 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})} 
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}