import { publicProcedure, router } from "./_core/trpc";
import { childrenRouter } from "./routers/children";
import { medicinesRouter } from "./routers/medicines";
import { incidentsRouter } from "./routers/incidents";
import { shiftsRouter } from "./routers/shifts";

export const appRouter = router({
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(() => {
      return {
        success: true,
      } as const;
    }),
  }),
  children: childrenRouter,
  medicines: medicinesRouter,
  incidents: incidentsRouter,
  shifts: shiftsRouter,
});

export type AppRouter = typeof appRouter;