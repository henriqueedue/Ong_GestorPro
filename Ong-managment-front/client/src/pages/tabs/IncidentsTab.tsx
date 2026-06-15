import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, AlertCircle, AlertTriangle, AlertOctagon } from "lucide-react";

const incidentSchema = z.object({
  childId: z.number().min(1, "Selecione uma crianca"),
  description: z.string().min(1, "Descricao eh obrigatoria"),
  severity: z.enum(["low", "medium", "high"]).default("medium"),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

const severityConfig = {
  low: {
    label: "Baixa",
    color: "bg-blue-100 dark:bg-blue-900",
    textColor: "text-blue-800 dark:text-blue-200",
    icon: AlertCircle,
    badgeColor: "bg-blue-200 dark:bg-blue-800",
  },
  medium: {
    label: "Media",
    color: "bg-yellow-100 dark:bg-yellow-900",
    textColor: "text-yellow-800 dark:text-yellow-200",
    icon: AlertTriangle,
    badgeColor: "bg-yellow-200 dark:bg-yellow-800",
  },
  high: {
    label: "Alta",
    color: "bg-red-100 dark:bg-red-900",
    textColor: "text-red-800 dark:text-red-200",
    icon: AlertOctagon,
    badgeColor: "bg-red-200 dark:bg-red-800",
  },
};

export default function IncidentsTab() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: children } = trpc.children.list.useQuery();
  const { data: incidents, isLoading } = trpc.incidents.list.useQuery();

  const createMutation = trpc.incidents.create.useMutation({
    onSuccess: () => {
      utils.incidents.list.invalidate();
      toast.success("Ocorrido registrado com sucesso!");
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao registrar ocorrido");
    },
  });

  const updateMutation = trpc.incidents.update.useMutation({
    onSuccess: () => {
      utils.incidents.list.invalidate();
      toast.success("Ocorrido atualizado com sucesso!");
      setOpen(false);
      setEditingId(null);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar ocorrido");
    },
  });

  const deleteMutation = trpc.incidents.delete.useMutation({
    onSuccess: () => {
      utils.incidents.list.invalidate();
      toast.success("Ocorrido removido com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover ocorrido");
    },
  });

  const form = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema) as any,
    defaultValues: {
      childId: 0,
      description: "",
      severity: "medium",
    },
  });

  const onSubmit = (data: IncidentFormData) => {
    if (editingId) {
      updateMutation.mutate({ incidentId: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (incident: any) => {
    setEditingId(incident.id);
    form.reset(incident);
    setOpen(true);
  };

  const handleDelete = (incidentId: number) => {
    if (confirm("Tem certeza que deseja remover este ocorrido?")) {
      deleteMutation.mutate({ incidentId });
    }
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
                form.reset();
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="childId"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Crianca</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma crianca" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {children?.map((child: any) => (
                            <SelectItem key={child.id} value={child.id.toString()}>
                              {child.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descricao</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o ocorrido em detalhes"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Severidade</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Media</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {incidents && incidents.length > 0 ? (
          incidents.map((incident: any) => {
            const config = severityConfig[incident.severity as keyof typeof severityConfig];
            const IconComponent = config.icon;
            return (
              <Card
                key={incident.id}
                className={`hover:shadow-md transition-shadow border-l-4 ${
                  incident.severity === "high"
                    ? "border-l-red-500"
                    : incident.severity === "medium"
                      ? "border-l-yellow-500"
                      : "border-l-blue-500"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`${config.color} p-3 rounded-lg mt-1`}>
                        <IconComponent className={`w-5 h-5 ${config.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">
                            {incident.childName}
                          </CardTitle>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${config.badgeColor}`}
                          >
                            {config.label}
                          </span>
                        </div>
                        <CardDescription className="text-sm mt-1">
                          {new Date(incident.timestamp).toLocaleString("pt-BR")}
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
                <CardContent>
                  <p className="text-slate-900 dark:text-white leading-relaxed">
                    {incident.description}
                  </p>
                </CardContent>
              </Card>
            );
          })
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
