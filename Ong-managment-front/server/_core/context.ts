import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import * as jose from "jose";
import type { User } from "../../drizzle/schema";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_change_in_production"
);

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const cookie = opts.req.headers.cookie;
    if (cookie) {
      const tokenMatch = cookie.match(/token=([^;]+)/);
      if (tokenMatch) {
        const token = tokenMatch[1];
        try {
          const { payload } = await jose.jwtVerify(token, JWT_SECRET);
          user = {
            id: payload.user_id as number,
            name: payload.name as string,
            email: payload.email as string,
            openId: null,
            loginMethod: "jwt",
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        } catch {
          user = null;
        }
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}