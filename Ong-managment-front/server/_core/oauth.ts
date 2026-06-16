import type { Express } from "express";
import * as db from "../db";

export function registerOAuthRoutes(app: Express) {
  // JWT authentication is handled directly in the frontend
  // This endpoint is kept for potential future OAuth integration
  app.get("/api/oauth/callback", async (req, res) => {
    // For now, redirect to login page
    res.redirect("/login");
  });
}