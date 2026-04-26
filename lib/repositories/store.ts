import { cache } from "react";
import { COLLECTIONS } from "@/lib/constants";
import { getDb, ensureIndexes } from "@/lib/db";
import {
  seedAgentLogs,
  seedAgentRuns,
  seedAuditLogs,
  seedDataset,
  seedDiners,
  seedPolicies,
  seedRecoveryRequests,
  seedReservations,
  seedRestaurants,
  seedSponsorEvents,
  seedUsers,
  seedWaitlistCandidates,
} from "@/lib/seed/seed-data";
import type {
  AgentLog,
  AgentRun,
  AuditLog,
  Diner,
  RecoveryRequest,
  Reservation,
  Restaurant,
  RestaurantClaim,
  RestaurantPolicy,
  SponsorEvent,
  User,
  WaitlistCandidate,
} from "@/lib/types";

type CollectionName = keyof typeof COLLECTIONS;

const memory = {
  users: [...seedUsers],
  restaurants: [...seedRestaurants],
  restaurantClaims: [] as RestaurantClaim[],
  restaurantPolicies: [...seedPolicies],
  diners: [...seedDiners],
  reservations: [...seedReservations],
  waitlistCandidates: [...seedWaitlistCandidates],
  recoveryRequests: [...seedRecoveryRequests],
  agentRuns: [...seedAgentRuns],
  agentLogs: [...seedAgentLogs],
  auditLogs: [...seedAuditLogs],
  sponsorEvents: [...seedSponsorEvents],
};

export function id(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function isoNow() {
  return new Date().toISOString();
}

async function list<T extends { _id: string }>(name: CollectionName, fallback: T[]): Promise<T[]> {
  const db = await getDb();
  if (!db) return fallback;
  const docs = (await db
    .collection(COLLECTIONS[name])
    .find({})
    .sort({ createdAt: -1 })
    .toArray()) as unknown as T[];
  if (!fallback.length) return docs;
  const seen = new Set(docs.map((d) => d._id));
  const merged = [...docs];
  for (const item of fallback) {
    if (!seen.has(item._id)) merged.push(item);
  }
  return merged;
}

async function listFiltered<T extends { _id: string }>(
  name: CollectionName,
  fallback: T[],
  filter: Record<string, unknown>,
  match: (item: T) => boolean,
): Promise<T[]> {
  const db = await getDb();
  if (!db) return fallback.filter(match);
  const docs = (await db
    .collection(COLLECTIONS[name])
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray()) as unknown as T[];
  const fallbackMatches = fallback.filter(match);
  if (!fallbackMatches.length) return docs;
  const seen = new Set(docs.map((d) => d._id));
  const merged = [...docs];
  for (const item of fallbackMatches) {
    if (!seen.has(item._id)) merged.push(item);
  }
  return merged;
}

async function findOne<T extends { _id: string }>(
  name: CollectionName,
  fallback: T[],
  _id: string,
): Promise<T | null> {
  const db = await getDb();
  if (!db) return fallback.find((item) => item._id === _id) ?? null;
  const doc = await db.collection<Record<string, unknown>>(COLLECTIONS[name]).findOne({ _id } as never);
  if (doc) return doc as unknown as T;
  return fallback.find((item) => item._id === _id) ?? null;
}

async function upsert<T extends { _id: string }>(name: CollectionName, item: T): Promise<T> {
  const db = await getDb();
  if (!db) {
    const target = memory[name as keyof typeof memory] as unknown as T[];
    const idx = target.findIndex((existing) => existing._id === item._id);
    if (idx >= 0) target[idx] = item;
    else target.unshift(item);
    return item;
  }
  await db.collection<Record<string, unknown>>(COLLECTIONS[name]).replaceOne({ _id: item._id } as never, item as never, {
    upsert: true,
  });
  return item;
}

async function remove(name: CollectionName, _id: string) {
  const db = await getDb();
  if (!db) {
    const target = memory[name as keyof typeof memory] as { _id: string }[];
    const idx = target.findIndex((existing) => existing._id === _id);
    if (idx >= 0) target.splice(idx, 1);
    return true;
  }
  await db.collection<Record<string, unknown>>(COLLECTIONS[name]).deleteOne({ _id } as never);
  return true;
}

export async function seedDatabase() {
  const db = await getDb();
  if (!db) return { mode: "demo-fallback", inserted: 0 };
  await ensureIndexes();
  let inserted = 0;
  for (const [name, docs] of Object.entries(seedDataset)) {
    const collectionName = COLLECTIONS[name as CollectionName];
    if (!collectionName || !Array.isArray(docs)) continue;
    for (const doc of docs as { _id: string }[]) {
      const result = await db.collection<Record<string, unknown>>(collectionName).updateOne(
        { _id: doc._id } as never,
        { $setOnInsert: doc },
        { upsert: true },
      );
      inserted += result.upsertedCount;
    }
  }
  return { mode: "mongodb", inserted };
}

export const listUsers = cache(async () =>
  list<User>("users", memory.users),
);

export async function getUser(_id: string) {
  return findOne<User>("users", memory.users, _id);
}

export async function getUserByAuthProviderId(authProviderId: string) {
  const users = await listUsers();
  return users.find((user) => user.authProviderId === authProviderId) ?? null;
}

export async function saveUser(user: User) {
  return upsert<User>("users", user);
}

export const listRestaurants = cache(async () =>
  list<Restaurant>("restaurants", memory.restaurants),
);

export async function listRestaurantsByOwner(ownerUserId: string) {
  return listFiltered<Restaurant>(
    "restaurants",
    memory.restaurants,
    { ownerUserId },
    (restaurant) => restaurant.ownerUserId === ownerUserId,
  );
}

export async function getRestaurantByPlaceId(placeId: string) {
  const restaurants = await listRestaurants();
  return restaurants.find((r) => r.externalIds.googlePlaceId === placeId) ?? null;
}

export async function getRestaurant(_id: string) {
  return findOne<Restaurant>("restaurants", memory.restaurants, _id);
}

export async function saveRestaurant(restaurant: Restaurant) {
  return upsert<Restaurant>("restaurants", restaurant);
}

export async function listRestaurantClaims(filter?: { restaurantId?: string; ownerUserId?: string }) {
  if (!filter || (!filter.restaurantId && !filter.ownerUserId)) {
    return list<RestaurantClaim>("restaurantClaims", memory.restaurantClaims);
  }
  const mongoFilter: Record<string, unknown> = {};
  if (filter.restaurantId) mongoFilter.restaurantId = filter.restaurantId;
  if (filter.ownerUserId) mongoFilter.ownerUserId = filter.ownerUserId;
  return listFiltered<RestaurantClaim>(
    "restaurantClaims",
    memory.restaurantClaims,
    mongoFilter,
    (claim) => {
      if (filter.restaurantId && claim.restaurantId !== filter.restaurantId) return false;
      if (filter.ownerUserId && claim.ownerUserId !== filter.ownerUserId) return false;
      return true;
    },
  );
}

export async function saveRestaurantClaim(claim: RestaurantClaim) {
  return upsert<RestaurantClaim>("restaurantClaims", claim);
}

export const listPolicies = cache(async () =>
  list<RestaurantPolicy>("restaurantPolicies", memory.restaurantPolicies),
);

export async function getPolicyForRestaurant(restaurantId: string) {
  const policies = await listPolicies();
  return (
    policies.find((policy) => policy.restaurantId === restaurantId) ??
    seedPolicies.find((policy) => policy.restaurantId === "rest_katsuya")!
  );
}

export async function savePolicy(policy: RestaurantPolicy) {
  return upsert<RestaurantPolicy>("restaurantPolicies", policy);
}

export const listDiners = cache(async () =>
  list<Diner>("diners", memory.diners),
);

export async function getDiner(_id: string) {
  return findOne<Diner>("diners", memory.diners, _id);
}

export async function saveDiner(diner: Diner) {
  return upsert<Diner>("diners", diner);
}

export const listReservations = cache(async () =>
  list<Reservation>("reservations", memory.reservations),
);

export async function getReservation(_id: string) {
  return findOne<Reservation>("reservations", memory.reservations, _id);
}

export async function saveReservation(reservation: Reservation) {
  return upsert<Reservation>("reservations", reservation);
}

export async function deleteReservation(_id: string) {
  return remove("reservations", _id);
}

export async function listReservationsByRestaurant(restaurantId: string) {
  return listFiltered<Reservation>(
    "reservations",
    memory.reservations,
    { restaurantId },
    (reservation) => reservation.restaurantId === restaurantId,
  );
}

export async function listReservationsByDiner(dinerId: string) {
  return listFiltered<Reservation>(
    "reservations",
    memory.reservations,
    { dinerId },
    (reservation) => reservation.dinerId === dinerId,
  );
}

export async function listWaitlistCandidates(restaurantId?: string) {
  if (!restaurantId) {
    return list<WaitlistCandidate>("waitlistCandidates", memory.waitlistCandidates);
  }
  return listFiltered<WaitlistCandidate>(
    "waitlistCandidates",
    memory.waitlistCandidates,
    { restaurantId },
    (candidate) => candidate.restaurantId === restaurantId,
  );
}

export async function saveWaitlistCandidate(candidate: WaitlistCandidate) {
  return upsert<WaitlistCandidate>("waitlistCandidates", candidate);
}

export const listRecoveryRequests = cache(async () =>
  list<RecoveryRequest>("recoveryRequests", memory.recoveryRequests),
);

export async function getRecoveryRequestByReservation(reservationId: string) {
  const requests = await listRecoveryRequests();
  return requests.find((request) => request.reservationId === reservationId) ?? null;
}

export async function saveRecoveryRequest(request: RecoveryRequest) {
  return upsert<RecoveryRequest>("recoveryRequests", request);
}

export async function listAgentRuns(reservationId?: string) {
  if (!reservationId) return list<AgentRun>("agentRuns", memory.agentRuns);
  return listFiltered<AgentRun>(
    "agentRuns",
    memory.agentRuns,
    { reservationId },
    (run) => run.reservationId === reservationId,
  );
}

export async function saveAgentRun(run: AgentRun) {
  return upsert<AgentRun>("agentRuns", run);
}

export async function listAgentLogs(reservationId?: string) {
  if (!reservationId) return list<AgentLog>("agentLogs", memory.agentLogs);
  return listFiltered<AgentLog>(
    "agentLogs",
    memory.agentLogs,
    { reservationId },
    (log) => log.reservationId === reservationId,
  );
}

export async function saveAgentLog(log: AgentLog) {
  return upsert<AgentLog>("agentLogs", log);
}

export async function listAuditLogs(entityId?: string) {
  if (!entityId) return list<AuditLog>("auditLogs", memory.auditLogs);
  return listFiltered<AuditLog>(
    "auditLogs",
    memory.auditLogs,
    { entityId },
    (log) => log.entityId === entityId,
  );
}

export async function saveAuditLog(log: AuditLog) {
  return upsert<AuditLog>("auditLogs", log);
}

export async function listSponsorEvents() {
  return list<SponsorEvent>("sponsorEvents", memory.sponsorEvents);
}

export async function saveSponsorEvent(event: SponsorEvent) {
  return upsert<SponsorEvent>("sponsorEvents", event);
}

export async function addAuditLog(input: Omit<AuditLog, "_id" | "createdAt">) {
  return saveAuditLog({ _id: id("audit"), createdAt: isoNow(), ...input });
}

export async function addSponsorEvent(input: Omit<SponsorEvent, "_id" | "createdAt">) {
  return saveSponsorEvent({ _id: id("sponsor"), createdAt: isoNow(), ...input });
}
