import { MongoClient, type Db } from "mongodb";
import { COLLECTIONS } from "./constants";
import { hasMongoConfig } from "./env";

declare global {
  var __restaurantyMongoClient: Promise<MongoClient> | undefined;
  var __restaurantyMongoWarning: string | undefined;
  var __restaurantyAutoSeed: Promise<void> | undefined;
}

const AUTO_SEED_ENABLED = process.env.RESTAURANTY_AUTO_SEED !== "false";

async function runAutoSeed(db: Db) {
  try {
    const { seedDataset } = await import("./seed/seed-data");
    for (const [name, docs] of Object.entries(seedDataset)) {
      const collectionName = COLLECTIONS[name as keyof typeof COLLECTIONS];
      if (!collectionName || !Array.isArray(docs)) continue;
      const ops = (docs as { _id: string }[]).map((doc) => ({
        updateOne: {
          filter: { _id: doc._id } as never,
          update: { $setOnInsert: doc } as never,
          upsert: true,
        },
      }));
      if (ops.length) {
        await db.collection<Record<string, unknown>>(collectionName).bulkWrite(ops, {
          ordered: false,
        });
      }
    }
  } catch (error) {
    console.warn(
      "Auto-seed skipped:",
      error instanceof Error ? error.message : error,
    );
  }
}

export async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  if (!hasMongoConfig() || !uri || !dbName) return null;
  if (!global.__restaurantyMongoClient) {
    global.__restaurantyMongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
    }).connect();
  }
  try {
    const client = await global.__restaurantyMongoClient;
    const db = client.db(dbName);
    if (AUTO_SEED_ENABLED && !global.__restaurantyAutoSeed) {
      global.__restaurantyAutoSeed = runAutoSeed(db);
    }
    return db;
  } catch (error) {
    global.__restaurantyMongoClient = undefined;
    global.__restaurantyMongoWarning = error instanceof Error ? error.message : "MongoDB connection failed";
    console.warn("MongoDB unavailable; using seeded demo fallback.", global.__restaurantyMongoWarning);
    return null;
  }
}

export async function requireDb(): Promise<Db> {
  const db = await getDb();
  if (!db) {
    throw new Error("MongoDB is not configured. Set MONGODB_URI and MONGODB_DB.");
  }
  return db;
}

export async function ensureIndexes() {
  const db = await getDb();
  if (!db) return { mode: "demo-fallback" };
  await Promise.all([
    db.collection(COLLECTIONS.restaurants).createIndex({ "externalIds.googlePlaceId": 1 }),
    db.collection(COLLECTIONS.reservations).createIndex({ restaurantId: 1 }),
    db.collection(COLLECTIONS.reservations).createIndex({ dinerId: 1 }),
    db.collection(COLLECTIONS.reservations).createIndex({ date: 1 }),
    db.collection(COLLECTIONS.reservations).createIndex({ riskLevel: 1 }),
    db.collection(COLLECTIONS.waitlistCandidates).createIndex({ restaurantId: 1 }),
    db.collection(COLLECTIONS.waitlistCandidates).createIndex({ status: 1 }),
    db.collection(COLLECTIONS.auditLogs).createIndex({ entityId: 1 }),
    db.collection(COLLECTIONS.agentLogs).createIndex({ reservationId: 1 }),
    db.collection(COLLECTIONS.sponsorEvents).createIndex({ sponsor: 1 }),
  ]);
  return { mode: "mongodb", dbName: db.databaseName };
}
