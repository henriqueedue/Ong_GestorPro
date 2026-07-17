import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createChild,
  getChildrenByUserId,
  getChildById,
  updateChild,
  deleteChild,
} from "../db";

export const childrenRouter = router({
  list: protectedProcedure.query(({ ctx }) => getChildrenByUserId(ctx.user.id)),

  get: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(({ input }) => getChildById(input.childId)),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nome eh obrigatorio"),
        dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data invalida"),
        responsible: z.string().min(1, "Responsavel eh obrigatorio"),
        contact: z.string().min(1, "Contato eh obrigatorio"),
        medicalInfo: z.string().optional(),
        observations: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) =>
      createChild({
        userId: ctx.user.id,
        name: input.name,
        dateOfBirth: input.dateOfBirth,
        responsible: input.responsible,
        contact: input.contact,
        medicalInfo: input.medicalInfo || null,
        observations: input.observations || null,
      })
    ),

  update: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        name: z.string().optional(),
        dateOfBirth: z.string().optional(),
        responsible: z.string().optional(),
        contact: z.string().optional(),
        medicalInfo: z.string().optional(),
        observations: z.string().optional(),
      })
    )
    .mutation(({ input }) => updateChild(input.childId, input)),

  delete: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .mutation(({ input }) => deleteChild(input.childId)),
});
