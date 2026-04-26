import { z } from "zod";

export const restaurantSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  cuisineCategories: z.array(z.string()).default([]),
  phone: z.string().optional(),
  website: z.string().optional(),
  imageUrl: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  price: z.string().optional(),
  address: z.string().min(1),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
  averageCheck: z.coerce.number().nonnegative().default(90),
  neighborhood: z.string().default("Unknown"),
  source: z.enum(["manual", "google_places", "seed"]).default("manual"),
  externalIds: z.object({ googlePlaceId: z.string().optional() }).default({}),
});

export const dinerSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  phone: z.string().min(7),
  email: z.string().email(),
  verifiedHuman: z.coerce.boolean().default(false),
  noShowCount: z.coerce.number().int().nonnegative().default(0),
  lateCancellationCount: z.coerce.number().int().nonnegative().default(0),
  completedReservations: z.coerce.number().int().nonnegative().default(0),
  activeReservations: z.coerce.number().int().nonnegative().default(0),
  trustScore: z.coerce.number().min(0).max(100).default(70),
  preferredCuisines: z.array(z.string()).default([]),
});

export const reservationInputSchema = z.object({
  restaurantId: z.string().min(1),
  dinerId: z.string().optional(),
  dinerName: z.string().optional(),
  dinerPhone: z.string().optional(),
  dinerEmail: z.string().email().optional(),
  date: z.string().min(8),
  startTime: z.string().min(3),
  partySize: z.coerce.number().int().min(1).max(20),
  status: z
    .enum([
      "scheduled",
      "confirmed",
      "unconfirmed",
      "final_confirmation_sent",
      "released_by_diner",
      "recovery_active",
      "recovered",
      "no_show",
      "cancelled",
      "completed",
    ])
    .default("scheduled"),
  confirmationStatus: z
    .enum(["not_requested", "requested", "confirmed", "ignored", "declined"])
    .default("not_requested"),
  reminderOpened: z.coerce.boolean().default(false),
  priorLateCancellationsAtBooking: z.coerce.number().int().nonnegative().default(0),
  priorNoShowsAtBooking: z.coerce.number().int().nonnegative().default(0),
  cardOnFile: z.coerce.boolean().default(false),
  bookedAt: z.string().optional(),
  highDemandSlot: z.coerce.boolean().default(false),
  estimatedRevenue: z.coerce.number().nonnegative().default(0),
  cancellationFee: z.coerce.number().nonnegative().default(0),
  source: z.enum(["manual", "csv", "api", "seed"]).default("manual"),
});

export const csvReservationRowSchema = z.object({
  restaurantName: z.string().min(1),
  date: z.string().min(8),
  startTime: z.string().min(3),
  partySize: z.coerce.number().int().min(1),
  dinerName: z.string().min(1),
  dinerPhone: z.string().min(7),
  dinerEmail: z.string().email(),
  status: z.string().default("scheduled"),
  cardOnFile: z.coerce.boolean().default(false),
  bookedAt: z.string().optional(),
  estimatedRevenue: z.coerce.number().nonnegative().default(0),
  cancellationFee: z.coerce.number().nonnegative().default(0),
});

export const waitlistInputSchema = z.object({
  dinerId: z.string().optional(),
  restaurantId: z.string().min(1),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  desiredDate: z.string().min(8),
  desiredTimeWindowStart: z.string().min(3),
  desiredTimeWindowEnd: z.string().min(3),
  partySize: z.coerce.number().int().min(1).max(20),
  distanceMiles: z.coerce.number().nonnegative().default(3),
  cuisineMatchScore: z.coerce.number().min(0).max(100).default(70),
  arrivalEtaMinutes: z.coerce.number().int().nonnegative().default(25),
  verifiedHuman: z.coerce.boolean().default(false),
  commitmentLevel: z
    .enum(["browsing", "quick_confirm", "deposit_ready", "instant_confirm"])
    .default("quick_confirm"),
});

export const policyInputSchema = z.object({
  restaurantId: z.string().min(1),
  confirmationWindowHours: z.coerce.number().int().min(1).max(72).default(3),
  finalConfirmationMinutes: z.coerce.number().int().min(5).max(120).default(15),
  waitlistRefillEnabled: z.coerce.boolean().default(true),
  peerTransferAllowed: z.coerce.boolean().default(false),
  paidResaleAllowed: z.coerce.boolean().default(false),
  restaurantApprovalRequired: z.coerce.boolean().default(true),
  maxTransferFee: z.coerce.number().min(0).default(0),
  feeWaiverIfRefilled: z.coerce.boolean().default(true),
  humanVerificationRequired: z.coerce.boolean().default(true),
  suspiciousAccountAutoReview: z.coerce.boolean().default(true),
  noShowGraceMinutes: z.coerce.number().int().min(0).max(60).default(10),
  autoReleaseAfterGracePeriod: z.coerce.boolean().default(false),
  managerApprovalPhone: z.string().optional(),
});

export const agentChatSchema = z.object({
  message: z.string().min(1),
  reservationId: z.string().optional(),
});
