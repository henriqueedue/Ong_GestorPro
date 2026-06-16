import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, children, medicines, incidents, shifts, 
  Child, InsertChild, Medicine, InsertMedicine, Incident, 
  InsertIncident, Shift, InsertShift 
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// Helper para evitar repetição de código
async function getDbOrThrow() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: Partial<InsertUser> = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    
    textFields.forEach((field) => {
      const value = user[field];
      // Correção: Garantimos que o valor não seja nulo para satisfazer o tipo 'string | undefined'
      if (value !== undefined && value !== null) {
        values[field] = value;
        updateSet[field] = value;
      }
    });

    if (user.role !== undefined && user.role !== null) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    await db.insert(users).values(values as InsertUser).onDuplicateKeyUpdate({ 
      set: updateSet 
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

// ============ CHILDREN QUERIES ============
export async function createChild(data: InsertChild): Promise<Child> {
  const db = await getDbOrThrow();
  const result = await db.insert(children).values(data);
  const childId = result[0].insertId;
  const child = await db.select().from(children).where(eq(children.id, childId as number)).limit(1);
  return child[0];
}

export async function getChildrenByUserId(userId: number): Promise<Child[]> {
  const db = await getDbOrThrow();
  return db.select().from(children).where(eq(children.userId, userId));
}

export async function getChildById(childId: number): Promise<Child | undefined> {
  const db = await getDbOrThrow();
  const result = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  return result[0];
}

export async function updateChild(childId: number, data: Partial<InsertChild>): Promise<Child> {
  const db = await getDbOrThrow();
  await db.update(children).set(data).where(eq(children.id, childId));
  const child = await getChildById(childId);
  if (!child) throw new Error("Child not found");
  return child;
}

export async function deleteChild(childId: number): Promise<void> {
  const db = await getDbOrThrow();
  await db.delete(children).where(eq(children.id, childId));
}

// ============ MEDICINES QUERIES ============
export async function createMedicine(data: InsertMedicine): Promise<Medicine> {
  const db = await getDbOrThrow();
  const result = await db.insert(medicines).values(data);
  const medId = result[0].insertId;
  const med = await db.select().from(medicines).where(eq(medicines.id, medId as number)).limit(1);
  return med[0];
}

export async function getMedicinesByChildId(childId: number): Promise<Medicine[]> {
  const db = await getDbOrThrow();
  return db.select().from(medicines).where(eq(medicines.childId, childId));
}

export async function updateMedicine(medicineId: number, data: Partial<InsertMedicine>): Promise<Medicine> {
  const db = await getDbOrThrow();
  await db.update(medicines).set(data).where(eq(medicines.id, medicineId));
  const med = await db.select().from(medicines).where(eq(medicines.id, medicineId)).limit(1);
  if (!med[0]) throw new Error("Medicine not found");
  return med[0];
}

export async function deleteMedicine(medicineId: number): Promise<void> {
  const db = await getDbOrThrow();
  await db.delete(medicines).where(eq(medicines.id, medicineId));
}

// ============ INCIDENTS QUERIES ============
export async function createIncident(data: InsertIncident): Promise<Incident> {
  const db = await getDbOrThrow();
  const result = await db.insert(incidents).values(data);
  const incId = result[0].insertId;
  const inc = await db.select().from(incidents).where(eq(incidents.id, incId as number)).limit(1);
  return inc[0];
}

export async function getIncidentsByUserId(userId: number): Promise<Incident[]> {
  const db = await getDbOrThrow();
  return db.select().from(incidents).where(eq(incidents.userId, userId));
}

export async function getIncidentsByChildId(childId: number): Promise<Incident[]> {
  const db = await getDbOrThrow();
  return db.select().from(incidents).where(eq(incidents.childId, childId));
}

export async function updateIncident(incidentId: number, data: Partial<InsertIncident>): Promise<Incident> {
  const db = await getDbOrThrow();
  await db.update(incidents).set(data).where(eq(incidents.id, incidentId));
  const inc = await db.select().from(incidents).where(eq(incidents.id, incidentId)).limit(1);
  if (!inc[0]) throw new Error("Incident not found");
  return inc[0];
}

export async function deleteIncident(incidentId: number): Promise<void> {
  const db = await getDbOrThrow();
  await db.delete(incidents).where(eq(incidents.id, incidentId));
}

// ============ SHIFTS QUERIES ============
export async function createShift(data: InsertShift): Promise<Shift> {
  const db = await getDbOrThrow();
  const result = await db.insert(shifts).values(data);
  const sId = result[0].insertId;
  const shift = await db.select().from(shifts).where(eq(shifts.id, sId as number)).limit(1);
  return shift[0];
}

export async function getShiftsByUserId(userId: number): Promise<Shift[]> {
  const db = await getDbOrThrow();
  return db.select().from(shifts).where(eq(shifts.userId, userId));
}

export async function updateShift(shiftId: number, data: Partial<InsertShift>): Promise<Shift> {
  const db = await getDbOrThrow();
  await db.update(shifts).set(data).where(eq(shifts.id, shiftId));
  const shift = await db.select().from(shifts).where(eq(shifts.id, shiftId)).limit(1);
  if (!shift[0]) throw new Error("Shift not found");
  return shift[0];
}

export async function deleteShift(shiftId: number): Promise<void> {
  const db = await getDbOrThrow();
  await db.delete(shifts).where(eq(shifts.id, shiftId));
}

// ============ HELPER FUNCTION (OTIMIZADA COM JOIN) ============
export async function getIncidentsWithChildren(userId: number) {
  const db = await getDbOrThrow();
  
  return await db
    .select({
      id: incidents.id,
      childId: incidents.childId,
      userId: incidents.userId,
      createdAt: incidents.createdAt,
      childName: children.name
    })
    .from(incidents)
    .leftJoin(children, eq(incidents.childId, children.id))
    .where(eq(incidents.userId, userId));
}


