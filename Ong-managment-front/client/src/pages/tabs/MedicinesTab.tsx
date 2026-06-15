import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Pill, Clock } from "lucide-react";

const medicineSchema = z.object({
  childId: z.number().min(1, "Selecione uma crianca"),
  name: z.string().min(1, "Nome do remedio eh obrigatorio"),
  dose: z.string().min(1, "Dose eh obrigatoria"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Horario invalido (HH:MM)"),
  responsible: z.string().min(1, "Responsavel eh obrigatorio"),
});

type MedicineFormData = z.infer<typeof medicineSchema>;

export default function MedicinesTab() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: children } = trpc.children.list.useQuery();
  const { data: medicines, isLoading } = trpc.medicines.listByChild.useQuery(
    { childId: selectedChildId || 0 },
    { enabled: !!selectedChildId }
  );

  const createMutation = trpc.medicines.create.useMutation({
    onSuccess: () => {
      utils.medicines.listByChild.invalidate();
      toast.success("Remedio cadastrado com sucesso!");
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao cadastrar remedio");
    },
  });

  const updateMutation = trpc.medicines.update.useMutation({
    onSuccess: () => {
      utils.medicines.listByChild.invalidate();
      toast.success("Remedio atualizado com sucesso!");
      setOpen(false);
      setEditingId(null);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar remedio");
    },
  });

  const deleteMutation = trpc.medicines.delete.useMutation({
    onSuccess: () => {
      utils.medicines.listByChild.invalidate();
      toast.success("Remedio removido com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover remedio");
    },
  });

  const form = useForm<MedicineFormData>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      childId: selectedChildId || 0,
      name: "",
      dose: "",
      time: "",
      responsible: "",
    },
  });

  const onSubmit = (data: MedicineFormData) => {
    if (editingId) {
      updateMutation.mutate({ medicineId: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (medicine: any) => {
    setEditingId(medicine.id);
    form.reset(medicine);
    setOpen(true);
  };

  const handleDelete = (medicineId: number) => {
    if (confirm("Tem certeza que deseja remover este remedio?")) {
      deleteMutation.mutate({ medicineId });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Remédios
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie os medicamentos das criancas
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                form.reset();
              }}
              disabled={!selectedChildId}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Remédio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Remedio" : "Cadastrar Novo Remedio"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do medicamento
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Remedio</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do medicamento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dose</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 5ml, 1 comprimido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horario</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="responsible"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsavel</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome de quem administra" {...field} />
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

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Selecione uma Crianca
          </label>
          <Select
            value={selectedChildId?.toString() || ""}
            onValueChange={(value) => {
              setSelectedChildId(parseInt(value));
              form.setValue("childId", parseInt(value));
            }}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Escolha uma crianca" />
            </SelectTrigger>
            <SelectContent>
              {children?.map((child: any) => (
                <SelectItem key={child.id} value={child.id.toString()}>
                  {child.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedChildId && (
          <div className="grid gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Spinner />
              </div>
            ) : medicines && medicines.length > 0 ? (
              medicines.map((medicine: any) => (
                <Card key={medicine.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                          <Pill className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{medicine.name}</CardTitle>
                          <CardDescription>
                            Dose: {medicine.dose}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(medicine)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(medicine.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Horario</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{medicine.time}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400">Responsavel</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{medicine.responsible}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <Pill className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">Nenhum remedio cadastrado</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
