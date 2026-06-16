import type { Express as ExpressType } from "express";
import { eq } from "drizzle-orm";
// Importamos o schema para ter acesso à tabela 'users'
import { users } from "@drizzle/schema";
// Importamos as funções de conexão e o banco
import { getDb } from "../db.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ong-gestor-pro-secret-key";

export function registerAuthRoutes(app: ExpressType) {
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const db = await getDb(); // Conectamos de forma assíncrona
      if (!db) return res.status(500).json({ error: "Banco indisponível" });

      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      // Usamos o select do Drizzle com a tabela importada do schema
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      const user = result[0];

      if (!user || !user.password) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        { user_id: user.id, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Atualiza o updatedAt (já que lastSignedIn não existe no schema)
      await db.update(users).set({ updatedAt: new Date() }).where(eq(users.id, user.id));

      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Erro ao fazer login" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Banco indisponível" });

      // Verifica duplicidade
      const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing.length > 0) {
        return res.status(409).json({ error: "Email já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        loginMethod: "email",
        role: "user",
      });

      res.status(201).json({ message: "Cadastro realizado com sucesso" });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Erro ao cadastrar usuário" });
    }
  });
}