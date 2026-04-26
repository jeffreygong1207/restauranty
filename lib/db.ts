import { MongoClient, type Db } from "mongodb";
import { COLLECTIONS } from "./constants";
import { hasMongoConfig } from "./env";

declare global {
  var __restaurantyMongoClient: Promise<MongoClient> | undefined;
}

export async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  if (!hasMongoConfig() || !uri || !dbName) return null;
  if (!global.__restaurantyMongoClient) {
    global.__restaurantyMongoClient = new MongoClient(uri).connect();
  }
  const client = await global.__restaurantyMongoClient;
  return client.db(dbName);
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
