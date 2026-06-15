import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, children, medicines, incidents, shifts, Child, InsertChild, Medicine, InsertMedicine, Incident, InsertIncident, Shift, InsertShift } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ CHILDREN QUERIES ============
export async function createChild(data: InsertChild): Promise<Child> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(children).values(data);
  const childId = result[0].insertId;
  const child = await db.select().from(children).where(eq(children.id, childId as number)).limit(1);
  return child[0];
}

export async function getChildrenByUserId(userId: number): Promise<Child[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(children).where(eq(children.userId, userId));
}

export async function getChildById(childId: number): Promise<Child | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  return result[0];
}

export async function updateChild(childId: number, data: Partial<InsertChild>): Promise<Child> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(children).set(data).where(eq(children.id, childId));
  const child = await getChildById(childId);
  if (!child) throw new Error("Child not found");
  return child;
}

export async function deleteChild(childId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(children).where(eq(children.id, childId));
}

// ============ MEDICINES QUERIES ============
export async function createMedicine(data: InsertMedicine): Promise<Medicine> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(medicines).values(data);
  const medicineId = result[0].insertId;
  const medicine = await db.select().from(medicines).where(eq(medicines.id, medicineId as number)).limit(1);
  return medicine[0];
}

export async function getMedicinesByChildId(childId: number): Promise<Medicine[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(medicines).where(eq(medicines.childId, childId));
}

export async function updateMedicine(medicineId: number, data: Partial<InsertMedicine>): Promise<Medicine> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(medicines).set(data).where(eq(medicines.id, medicineId));
  const medicine = await db.select().from(medicines).where(eq(medicines.id, medicineId)).limit(1);
  if (!medicine[0]) throw new Error("Medicine not found");
  return medicine[0];
}

export async function deleteMedicine(medicineId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(medicines).where(eq(medicines.id, medicineId));
}

// ============ INCIDENTS QUERIES ============
export async function createIncident(data: InsertIncident): Promise<Incident> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(incidents).values(data);
  const incidentId = result[0].insertId;
  const incident = await db.select().from(incidents).where(eq(incidents.id, incidentId as number)).limit(1);
  return incident[0];
}

export async function getIncidentsByUserId(userId: number): Promise<Incident[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(incidents).where(eq(incidents.userId, userId));
}

export async function getIncidentsByChildId(childId: number): Promise<Incident[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(incidents).where(eq(incidents.childId, childId));
}

export async function updateIncident(incidentId: number, data: Partial<InsertIncident>): Promise<Incident> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(incidents).set(data).where(eq(incidents.id, incidentId));
  const incident = await db.select().from(incidents).where(eq(incidents.id, incidentId)).limit(1);
  if (!incident[0]) throw new Error("Incident not found");
  return incident[0];
}

export async function deleteIncident(incidentId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(incidents).where(eq(incidents.id, incidentId));
}

// ============ SHIFTS QUERIES ============
export async function createShift(data: InsertShift): Promise<Shift> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(shifts).values(data);
  const shiftId = result[0].insertId;
  const shift = await db.select().from(shifts).where(eq(shifts.id, shiftId as number)).limit(1);
  return shift[0];
}

export async function getShiftsByUserId(userId: number): Promise<Shift[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(shifts).where(eq(shifts.userId, userId));
}

export async function updateShift(shiftId: number, data: Partial<InsertShift>): Promise<Shift> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(shifts).set(data).where(eq(shifts.id, shiftId));
  const shift = await db.select().from(shifts).where(eq(shifts.id, shiftId)).limit(1);
  if (!shift[0]) throw new Error("Shift not found");
  return shift[0];
}

export async function deleteShift(shiftId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(shifts).where(eq(shifts.id, shiftId));
}

// ============ HELPER FUNCTION ============
export async function getIncidentsWithChildren(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const allIncidents = await db.select().from(incidents).where(eq(incidents.userId, userId));
  
  const incidentsWithChildren = await Promise.all(
    allIncidents.map(async (incident) => {
      const child = await getChildById(incident.childId);
      return {
        ...incident,
        childName: child?.name || "Unknown",
      };
    })
  );
  
  return incidentsWithChildren;
}
