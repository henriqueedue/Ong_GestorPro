import { serial, mysqlTable, timestamp, varchar, text, int } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: varchar("role", { length: 50 }).default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Children table - stores information about each child in care
 */
export const children = mysqlTable("children", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(), // Adicionado para permitir consultas por usuário
  name: varchar("name", { length: 255 }).notNull(),
  birthDate: timestamp("birth_date"),
  gender: varchar("gender", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export type Child = typeof children.$inferSelect;
export type InsertChild = typeof children.$inferInsert;

/**
 * Medicines table - stores medication information for each child
 */
export const medicines = mysqlTable("medicines", {
  id: serial("id").primaryKey(),
  childId: int("child_id").notNull(), // Alterado para int
  name: varchar("name", { length: 255 }).notNull(),
  dosage: varchar("dosage", { length: 100 }),
  schedule: varchar("schedule", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export type Medicine = typeof medicines.$inferSelect;
export type InsertMedicine = typeof medicines.$inferInsert;

/**
 * Incidents table - stores incident/event records for each child
 */
export const incidents = mysqlTable("incidents", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(), // Adicionado para permitir consultas por usuário
  childId: int("child_id").notNull(), // Alterado para int
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = typeof incidents.$inferInsert;

/**
 * Shifts table - stores shift handover information
 */
export const shifts = mysqlTable("shifts", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(), // Mantido como int
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  status: varchar("status", { length: 50 }).default("scheduled"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export type Shift = typeof shifts.$inferSelect;
export type InsertShift = typeof shifts.$inferInsert;