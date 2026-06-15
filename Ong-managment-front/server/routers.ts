import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { childrenRouter } from "./routers/children";
import { medicinesRouter } from "./routers/medicines";
import { incidentsRouter } from "./routers/incidents";
import { shiftsRouter } from "./routers/shifts";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
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
