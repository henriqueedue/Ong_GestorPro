import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createMedicine,
  getMedicinesByChildId,
  updateMedicine,
  deleteMedicine,
} from "../db";

export const medicinesRouter = router({
  listByChild: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(({ input }) => getMedicinesByChildId(input.childId)),

  create: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        name: z.string().min(1, "Nome do remedio eh obrigatorio"),
        dose: z.string().min(1, "Dose eh obrigatoria"),
        time: z.string().regex(/^\d{2}:\d{2}$/, "Horario invalido (HH:MM)"),
        responsible: z.string().min(1, "Responsavel eh obrigatorio"),
      })
    )
    .mutation(({ ctx, input }) =>
      createMedicine({
        userId: ctx.user.id,
        childId: input.childId,
        name: input.name,
        dose: input.dose,
        time: input.time,
        responsible: input.responsible,
      })
    ),

  update: protectedProcedure
    .input(
      z.object({
        medicineId: z.number(),
        name: z.string().optional(),
        dose: z.string().optional(),
        time: z.string().optional(),
        responsible: z.string().optional(),
      })
    )
    .mutation(({ input }) => updateMedicine(input.medicineId, input)),

  delete: protectedProcedure
    .input(z.object({ medicineId: z.number() }))
    .mutation(({ input }) => deleteMedicine(input.medicineId)),
});
