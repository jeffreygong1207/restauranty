export type UserRole =
  | "restaurant_manager"
  | "diner"
  | "replacement_diner"
  | "admin";

export type Timestamped = {
  createdAt: string;
  updatedAt: string;
};

export type User = Timestamped & {
  _id: string;
  authProvider: "auth0" | "demo";
  authProviderId: string;
  email: string;
  name: string;
  role: UserRole;
};

export type ClaimStatus = "pending" | "approved" | "rejected" | "verified";
export type ClaimMethod = "self_attested" | "email_domain" | "phone" | "admin_review";
export type BusinessStatus =
  | "OPERATIONAL"
  | "CLOSED_TEMPORARILY"
  | "CLOSED_PERMANENTLY"
  | "UNKNOWN";

export type Restaurant = Timestamped & {
  _id: string;
  source: "manual" | "google_places" | "seed";
  claimed?: boolean;
  claimStatus?: ClaimStatus;
  externalIds: { googlePlaceId?: string };
  name: string;
  cuisineCategories: string[];
  phone?: string;
  website?: string;
  imageUrl?: string;
  cloudinaryImageUrl?: string;
  rating?: number;
  reviewCount?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  price?: string;
  businessStatus?: BusinessStatus;
  types?: string[];
  googleMapsUri?: string;
  address: string;
  coordinates: { lat: number; lng: number };
  averageCheck: number;
  neighborhood: string;
  ownerUserId?: string;
  managerName?: string;
  managerPhone?: string;
};

export type RestaurantClaim = Timestamped & {
  _id: string;
  restaurantId: string;
  ownerUserId: string;
  status: ClaimStatus;
  claimMethod: ClaimMethod;
  evidence?: Record<string, unknown>;
};

export type RestaurantPolicy = Timestamped & {
  _id: string;
  restaurantId: string;
  confirmationWindowHours: number;
  finalConfirmationMinutes: number;
  waitlistRefillEnabled: boolean;
  peerTransferAllowed: boolean;
  paidResaleAllowed: boolean;
  restaurantApprovalRequired: boolean;
  maxTransferFee: number;
  feeWaiverIfRefilled: boolean;
  humanVerificationRequired: boolean;
  suspiciousAccountAutoReview: boolean;
  noShowGraceMinutes: number;
  autoReleaseAfterGracePeriod: boolean;
  managerApprovalPhone?: string;
};

export type Diner = Timestamped & {
  _id: string;
  userId?: string;
  name: string;
  phone: string;
  email: string;
  verifiedHuman: boolean;
  worldIdNullifierHash?: string;
  noShowCount: number;
  lateCancellationCount: number;
  completedReservations: number;
  activeReservations: number;
  trustScore: number;
  preferredCuisines: string[];
  homeCoordinates?: { lat: number; lng: number };
};

export type ReservationStatus =
  | "scheduled"
  | "confirmed"
  | "unconfirmed"
  | "final_confirmation_sent"
  | "released_by_diner"
  | "recovery_active"
  | "recovered"
  | "no_show"
  | "cancelled"
  | "completed";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type Reservation = Timestamped & {
  _id: string;
  restaurantId: string;
  dinerId: string;
  source: "manual" | "csv" | "api" | "seed";
  date: string;
  startTime: string;
  partySize: number;
  status: ReservationStatus;
  confirmationStatus:
    | "not_requested"
    | "requested"
    | "confirmed"
    | "ignored"
    | "declined";
  reminderOpened: boolean;
  reminderSentAt?: string;
  finalConfirmationSentAt?: string;
  priorLateCancellationsAtBooking: number;
  priorNoShowsAtBooking: number;
  cardOnFile: boolean;
  bookedAt: string;
  highDemandSlot: boolean;
  estimatedRevenue: number;
  cancellationFee: number;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendedAction: string;
  recoveryStatus?: string;
};

export type WaitlistCandidate = Timestamped & {
  _id: string;
  dinerId: string;
  restaurantId: string;
  desiredDate: string;
  desiredTimeWindowStart: string;
  desiredTimeWindowEnd: string;
  partySize: number;
  distanceMiles: number;
  cuisineMatchScore: number;
  arrivalEtaMinutes: number;
  verifiedHuman: boolean;
  commitmentLevel:
    | "browsing"
    | "quick_confirm"
    | "deposit_ready"
    | "instant_confirm";
  priorityScore: number;
  status:
    | "available"
    | "notified"
    | "accepted"
    | "rejected"
    | "expired"
    | "blocked"
    | "selected";
};

export type RecoveryRequest = Timestamped & {
  _id: string;
  reservationId: string;
  restaurantId: string;
  originalDinerId: string;
  selectedReplacementDinerId?: string;
  status:
    | "drafted"
    | "confirmation_sent"
    | "waitlist_matching"
    | "manager_approval_required"
    | "approved"
    | "rejected"
    | "recovered"
    | "failed";
  policySnapshot?: unknown;
  riskSnapshot?: unknown;
  selectedCandidateSnapshot?: unknown;
  revenueProtected: number;
  feeWaived: boolean;
  startedAt?: string;
  completedAt?: string;
};

export type AgentRun = {
  _id: string;
  recoveryRequestId?: string;
  reservationId: string;
  status: "started" | "completed" | "failed";
  agentsInvoked: string[];
  inputSnapshot: unknown;
  outputSnapshot?: unknown;
  error?: string;
  createdAt: string;
  completedAt?: string;
};

export type AgentLog = {
  _id: string;
  agentRunId: string;
  reservationId: string;
  agentName: string;
  message: string;
  severity: "info" | "warning" | "error" | "success";
  status: string;
  metadata?: unknown;
  createdAt: string;
};

export type AuditLog = {
  _id: string;
  actorType: "system" | "user" | "agent" | "external_api";
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
  createdAt: string;
};

export type SponsorEvent = {
  _id: string;
  sponsor:
    | "fetch_ai"
    | "mongodb"
    | "auth0"
    | "world_id"
    | "figma"
    | "arista"
    | "cognition"
    | "elevenlabs"
    | "cloudinary"
    | "gemma"
    | "vultr"
    | "godaddy";
  eventType: string;
  payload?: unknown;
  createdAt: string;
};

export type NotificationEvent = {
  _id: string;
  provider: "twilio" | "simulated" | "email" | "elevenlabs";
  recipient: string;
  message: string;
  status: string;
  metadata?: unknown;
  createdAt: string;
};

export type ExternalIntegration = Timestamped & {
  _id: string;
  provider:
    | "mongodb"
    | "google_places"
    | "twilio"
    | "auth0"
    | "world_id"
    | "agentverse"
    | "openai"
    | "anthropic"
    | "elevenlabs"
    | "cloudinary"
    | "gemma";
  enabled: boolean;
  configured: boolean;
  lastStatus: "configured" | "missing" | "ok" | "warning" | "error";
  lastError?: string;
  lastCheckedAt: string;
};

export type RiskFactor = {
  name: string;
  weight: number;
  reason: string;
};

export type RiskResult = {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  explanation: string;
  recommendedAction: string;
};

export type PolicyDecision = {
  allowed: boolean;
  requiresManagerApproval: boolean;
  waitlistRefillAllowed: boolean;
  feeWaiverAllowed: boolean;
  paidResaleBlocked: boolean;
  explanation: string;
  warnings: string[];
};

export type FairnessDecision = {
  candidateId: string;
  decision: "allow" | "downgrade" | "block";
  reason: string;
  visibleWarning?: string;
};
