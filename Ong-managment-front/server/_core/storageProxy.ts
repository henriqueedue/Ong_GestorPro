import type { Express } from "express";
import path from "node:path";
import fs from "node:fs";

const UPLOAD_DIR = path.join(import.meta.dirname, "..", "..", "uploads");

export function registerStorageProxy(app: Express) {
  app.get("/uploads/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    const filePath = path.join(UPLOAD_DIR, key);

    if (!fs.existsSync(filePath)) {
      res.status(404).send("File not found");
      return;
    }

    res.set("Cache-Control", "public, max-age=31536000");
    res.sendFile(filePath);
  });
}