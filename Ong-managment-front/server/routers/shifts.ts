import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createShift,
  getShiftsByUserId,
  updateShift,
  deleteShift,
} from "../db";

export const shiftsRouter = router({
  list: protectedProcedure.query(({ ctx }) => getShiftsByUserId(ctx.user.id)),

  create: protectedProcedure
    .input(
      z.object({
        shift: z.enum(["morning", "afternoon", "night"]),
        responsible: z.string().min(1, "Responsavel eh obrigatorio"),
        startTime: z.date(),
        endTime: z.date().optional(),
        observations: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) =>
      createShift({
        userId: ctx.user.id,
        shift: input.shift,
        responsible: input.responsible,
        startTime: input.startTime,
        endTime: input.endTime || null,
        observations: input.observations || null,
      })
    ),

  update: protectedProcedure
    .input(
      z.object({
        shiftId: z.number(),
        shift: z.enum(["morning", "afternoon", "night"]).optional(),
        responsible: z.string().optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        observations: z.string().optional(),
      })
    )
    .mutation(({ input }) => updateShift(input.shiftId, input)),

  delete: protectedProcedure
    .input(z.object({ shiftId: z.number() }))
    .mutation(({ input }) => deleteShift(input.shiftId)),
});
