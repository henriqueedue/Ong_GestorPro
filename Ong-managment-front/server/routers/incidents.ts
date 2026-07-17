import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createIncident,
  getIncidentsByUserId,
  getIncidentsWithChildren,
  updateIncident,
  deleteIncident,
} from "../db";

export const incidentsRouter = router({
  list: protectedProcedure.query(({ ctx }) => getIncidentsWithChildren(ctx.user.id)),

  create: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        description: z.string().min(1, "Descricao eh obrigatoria"),
        severity: z.enum(["low", "medium", "high"]).default("medium"),
      })
    )
    .mutation(({ ctx, input }) =>
      createIncident({
        userId: ctx.user.id,
        childId: input.childId,
        description: input.description,
        severity: input.severity,
        timestamp: new Date(),
      })
    ),

  update: protectedProcedure
    .input(
      z.object({
        incidentId: z.number(),
        description: z.string().optional(),
        severity: z.enum(["low", "medium", "high"]).optional(),
      })
    )
    .mutation(({ input }) => updateIncident(input.incidentId, input)),

  delete: protectedProcedure
    .input(z.object({ incidentId: z.number() }))
    .mutation(({ input }) => deleteIncident(input.incidentId)),
});
