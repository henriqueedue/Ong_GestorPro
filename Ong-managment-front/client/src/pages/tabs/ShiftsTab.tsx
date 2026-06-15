import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Clock, User } from "lucide-react";

const shiftSchema = z.object({
  shift: z.enum(["morning", "afternoon", "night"]),
  responsible: z.string().min(1, "Responsavel eh obrigatorio"),
  startTime: z.string().min(1, "Horario de inicio eh obrigatorio"),
  endTime: z.string().optional(),
  observations: z.string().optional(),
});

type ShiftFormData = z.infer<typeof shiftSchema>;

const shiftConfig = {
  morning: { label: "Matutino (6h - 14h)", color: "bg-amber-100 dark:bg-amber-900" },
  afternoon: { label: "Vespertino (14h - 22h)", color: "bg-orange-100 dark:bg-orange-900" },
  night: { label: "Noturno (22h - 6h)", color: "bg-indigo-100 dark:bg-indigo-900" },
};

export default function ShiftsTab() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: shifts, isLoading } = trpc.shifts.list.useQuery();

  const createMutation = trpc.shifts.create.useMutation({
    onSuccess: () => {
      utils.shifts.list.invalidate();
      toast.success("Plantao registrado com sucesso!");
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao registrar plantao");
    },
  });

  const updateMutation = trpc.shifts.update.useMutation({
    onSuccess: () => {
      utils.shifts.list.invalidate();
      toast.success("Plantao atualizado com sucesso!");
      setOpen(false);
      setEditingId(null);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar plantao");
    },
  });

  const deleteMutation = trpc.shifts.delete.useMutation({
    onSuccess: () => {
      utils.shifts.list.invalidate();
      toast.success("Plantao removido com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover plantao");
    },
  });

  const form = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      shift: "morning",
      responsible: "",
      startTime: "",
      endTime: "",
      observations: "",
    },
  });

  const onSubmit = (data: ShiftFormData) => {
    const startTime = new Date(data.startTime);
    const endTime = data.endTime ? new Date(data.endTime) : undefined;

    if (editingId) {
      updateMutation.mutate({
        shiftId: editingId,
        shift: data.shift,
        responsible: data.responsible,
        startTime,
        endTime,
        observations: data.observations,
      });
    } else {
      createMutation.mutate({
        shift: data.shift,
        responsible: data.responsible,
        startTime,
        endTime,
        observations: data.observations,
      });
    }
  };

  const handleEdit = (shift: any) => {
    setEditingId(shift.id);
    form.reset({
      shift: shift.shift,
      responsible: shift.responsible,
      startTime: shift.startTime?.toISOString().slice(0, 16) || "",
      endTime: shift.endTime?.toISOString().slice(0, 16) || "",
      observations: shift.observations || "",
    });
    setOpen(true);
  };

  const handleDelete = (shiftId: number) => {
    if (confirm("Tem certeza que deseja remover este plantao?")) {
      deleteMutation.mutate({ shiftId });
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
            Plantão
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie a passagem de plantao
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
              Novo Plantão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Plantao" : "Registrar Novo Plantao"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da passagem de plantao
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="shift"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turno</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="morning">Matutino (6h - 14h)</SelectItem>
                          <SelectItem value="afternoon">Vespertino (14h - 22h)</SelectItem>
                          <SelectItem value="night">Noturno (22h - 6h)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="responsible"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plantonista Responsavel</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do plantonista" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horario de Inicio</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horario de Termino</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observacoes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Observacoes gerais do plantao" {...field} />
                      </FormControl>
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
        {shifts && shifts.length > 0 ? (
          shifts.map((shift: any) => {
            const config = shiftConfig[shift.shift as keyof typeof shiftConfig];
            return (
              <Card key={shift.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`${config.color} p-3 rounded-lg`}>
                        <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{config.label}</CardTitle>
                        </div>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <User className="w-4 h-4" />
                          {shift.responsible}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(shift)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(shift.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Inicio</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {new Date(shift.startTime).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    {shift.endTime && (
                      <div>
                        <p className="text-slate-600 dark:text-slate-400">Termino</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {new Date(shift.endTime).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    )}
                  </div>
                  {shift.observations && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Observacoes</p>
                      <p className="text-slate-900 dark:text-white">{shift.observations}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="text-center py-12">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Nenhum plantao registrado</p>
          </Card>
        )}
      </div>
    </div>
  );
}
