import type { Express } from "express";

// 🌟 CORREÇÃO: Adicionado o '.js' no final para o Node.js em produção encontrar o arquivo
import * as db from "../db.js"; 

export function registerOAuthRoutes(app: Express) {
  // JWT authentication is handled directly in the frontend
  // This endpoint is kept for potential future OAuth integration
  app.get("/api/oauth/callback", async (req, res) => {
    // For now, redirect to login page
    res.redirect("/login");
  });
}