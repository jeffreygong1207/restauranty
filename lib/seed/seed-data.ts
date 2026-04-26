import type {
  AgentLog,
  AgentRun,
  AuditLog,
  Diner,
  RecoveryRequest,
  Reservation,
  Restaurant,
  RestaurantPolicy,
  SponsorEvent,
  User,
  WaitlistCandidate,
} from "@/lib/types";
import { DEMO_USERS } from "@/lib/constants";

const now = "2026-04-26T00:00:00.000Z";

const stamp = { createdAt: now, updatedAt: now };

export const seedUsers: User[] = DEMO_USERS.map((user) => ({
  ...user,
  ...stamp,
})) as User[];

const westwoodImage = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=80`;

const verifiedSeedClaim = { claimed: true, claimStatus: "verified" as const };

export const seedRestaurants: Restaurant[] = [
  {
    _id: "rest_katsuya",
    source: "seed",
    externalIds: { googlePlaceId: "seed-katsuya-west-hollywood" },
    name: "Katsuya West Hollywood",
    cuisineCategories: ["sushi", "japanese", "high-demand"],
    phone: "+13236556767",
    website: "https://restauranty.demo/katsuya",
    imageUrl: westwoodImage("photo-1579871494447-9811cf80d66c"),
    rating: 4.5,
    reviewCount: 1860,
    price: "$$$",
    address: "6300 Hollywood Blvd, Los Angeles, CA",
    coordinates: { lat: 34.1016, lng: -118.3267 },
    averageCheck: 90,
    neighborhood: "West Hollywood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_bestia",
    source: "seed",
    externalIds: { googlePlaceId: "seed-bestia" },
    name: "Bestia",
    cuisineCategories: ["italian", "arts district"],
    phone: "+12135145724",
    imageUrl: westwoodImage("photo-1559339352-11d035aa65de"),
    rating: 4.6,
    reviewCount: 4200,
    price: "$$$",
    address: "2121 E 7th Pl, Los Angeles, CA",
    coordinates: { lat: 34.0336, lng: -118.2295 },
    averageCheck: 105,
    neighborhood: "Arts District",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_republique",
    source: "seed",
    externalIds: { googlePlaceId: "seed-republique" },
    name: "Republique",
    cuisineCategories: ["french", "california"],
    phone: "+13103626110",
    imageUrl: westwoodImage("photo-1414235077428-338989a2e8c0"),
    rating: 4.7,
    reviewCount: 3500,
    price: "$$$",
    address: "624 S La Brea Ave, Los Angeles, CA",
    coordinates: { lat: 34.0634, lng: -118.3441 },
    averageCheck: 82,
    neighborhood: "Hancock Park",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_napa_valley_grille",
    source: "seed",
    externalIds: { googlePlaceId: "seed-napa-valley-grille" },
    name: "Napa Valley Grille",
    cuisineCategories: ["california", "american", "wine bar"],
    phone: "+13104790888",
    imageUrl: westwoodImage("photo-1592861956120-e524fc739696"),
    rating: 4.4,
    reviewCount: 920,
    price: "$$$",
    address: "1100 Glendon Ave, Los Angeles, CA 90024",
    coordinates: { lat: 34.0617, lng: -118.4441 },
    averageCheck: 78,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_tanino_ristorante",
    source: "seed",
    externalIds: { googlePlaceId: "seed-tanino-ristorante" },
    name: "Tanino Ristorante & Bar",
    cuisineCategories: ["italian", "wine bar"],
    phone: "+13102084104",
    imageUrl: westwoodImage("photo-1555396273-367ea4eb4db5"),
    rating: 4.3,
    reviewCount: 640,
    price: "$$$",
    address: "1043 Westwood Blvd, Los Angeles, CA 90024",
    coordinates: { lat: 34.0613, lng: -118.4438 },
    averageCheck: 72,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_matteos",
    source: "seed",
    externalIds: { googlePlaceId: "seed-matteos-westwood" },
    name: "Matteo's Hollywood",
    cuisineCategories: ["italian", "old hollywood"],
    phone: "+13104750125",
    imageUrl: westwoodImage("photo-1481931098730-318b6f776db0"),
    rating: 4.5,
    reviewCount: 510,
    price: "$$$$",
    address: "2321 Westwood Blvd, Los Angeles, CA 90064",
    coordinates: { lat: 34.0426, lng: -118.4416 },
    averageCheck: 110,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_saffron_and_rose",
    source: "seed",
    externalIds: { googlePlaceId: "seed-saffron-and-rose" },
    name: "Saffron and Rose Ice Cream",
    cuisineCategories: ["persian", "dessert", "ice cream"],
    phone: "+13104787677",
    imageUrl: westwoodImage("photo-1567206563064-6f60f40a2b57"),
    rating: 4.7,
    reviewCount: 1820,
    price: "$",
    address: "1387 Westwood Blvd, Los Angeles, CA 90024",
    coordinates: { lat: 34.0508, lng: -118.4416 },
    averageCheck: 18,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_shamshiri_grill",
    source: "seed",
    externalIds: { googlePlaceId: "seed-shamshiri-grill" },
    name: "Shamshiri Grill",
    cuisineCategories: ["persian", "kebabs", "halal"],
    phone: "+13104741410",
    imageUrl: westwoodImage("photo-1544025162-d76694265947"),
    rating: 4.4,
    reviewCount: 1180,
    price: "$$",
    address: "1712 Westwood Blvd, Los Angeles, CA 90024",
    coordinates: { lat: 34.0463, lng: -118.4422 },
    averageCheck: 38,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_sunnin_lebanese",
    source: "seed",
    externalIds: { googlePlaceId: "seed-sunnin-lebanese" },
    name: "Sunnin Lebanese Cafe",
    cuisineCategories: ["lebanese", "mediterranean", "halal"],
    phone: "+13104747700",
    imageUrl: westwoodImage("photo-1540189549336-e6e99c3679fe"),
    rating: 4.5,
    reviewCount: 980,
    price: "$$",
    address: "1779 Westwood Blvd, Los Angeles, CA 90024",
    coordinates: { lat: 34.0454, lng: -118.4422 },
    averageCheck: 32,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_800_degrees",
    source: "seed",
    externalIds: { googlePlaceId: "seed-800-degrees-westwood" },
    name: "800 Degrees Neapolitan Pizzeria",
    cuisineCategories: ["pizza", "italian", "casual"],
    phone: "+13105520099",
    imageUrl: westwoodImage("photo-1565299624946-b28f40a0ae38"),
    rating: 4.3,
    reviewCount: 2150,
    price: "$$",
    address: "10889 Lindbrook Dr, Los Angeles, CA 90024",
    coordinates: { lat: 34.0628, lng: -118.4456 },
    averageCheck: 24,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_lamonicas",
    source: "seed",
    externalIds: { googlePlaceId: "seed-lamonicas-pizza" },
    name: "Lamonica's NY Pizza",
    cuisineCategories: ["pizza", "ny style", "casual"],
    phone: "+13102089728",
    imageUrl: westwoodImage("photo-1574071318508-1cdbab80d002"),
    rating: 4.4,
    reviewCount: 1340,
    price: "$",
    address: "1066 Gayley Ave, Los Angeles, CA 90024",
    coordinates: { lat: 34.0625, lng: -118.4458 },
    averageCheck: 18,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_boiling_crab",
    source: "seed",
    externalIds: { googlePlaceId: "seed-boiling-crab-westwood" },
    name: "The Boiling Crab",
    cuisineCategories: ["seafood", "cajun", "vietnamese"],
    phone: "+14242974090",
    imageUrl: westwoodImage("photo-1559737558-2f5a35f4523b"),
    rating: 4.3,
    reviewCount: 2980,
    price: "$$",
    address: "11854 Wilshire Blvd, Los Angeles, CA 90025",
    coordinates: { lat: 34.0489, lng: -118.4595 },
    averageCheck: 48,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_tatsu_ramen",
    source: "seed",
    externalIds: { googlePlaceId: "seed-tatsu-ramen-westwood" },
    name: "Tatsu Ramen",
    cuisineCategories: ["ramen", "japanese", "casual"],
    phone: "+13104704121",
    imageUrl: westwoodImage("photo-1623341214825-9f4f963727da"),
    rating: 4.5,
    reviewCount: 1620,
    price: "$$",
    address: "11233 Wilshire Blvd, Los Angeles, CA 90025",
    coordinates: { lat: 34.0494, lng: -118.4504 },
    averageCheck: 22,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_headlines_diner",
    source: "seed",
    externalIds: { googlePlaceId: "seed-headlines-diner" },
    name: "Headlines Diner & Press Club",
    cuisineCategories: ["american", "diner", "breakfast"],
    phone: "+13104780022",
    imageUrl: westwoodImage("photo-1550547660-d9450f859349"),
    rating: 4.2,
    reviewCount: 760,
    price: "$$",
    address: "10922 Kinross Ave, Los Angeles, CA 90024",
    coordinates: { lat: 34.0631, lng: -118.4474 },
    averageCheck: 26,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_bollywood_bistro",
    source: "seed",
    externalIds: { googlePlaceId: "seed-bollywood-bistro" },
    name: "Bollywood Bistro",
    cuisineCategories: ["indian", "halal", "vegetarian-friendly"],
    phone: "+13107949114",
    imageUrl: westwoodImage("photo-1601050690597-df0568f70950"),
    rating: 4.4,
    reviewCount: 540,
    price: "$$",
    address: "1059 Glendon Ave, Los Angeles, CA 90024",
    coordinates: { lat: 34.0617, lng: -118.4445 },
    averageCheck: 36,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_ravello_osteria",
    source: "seed",
    externalIds: { googlePlaceId: "seed-ravello-osteria" },
    name: "Ravello Osteria",
    cuisineCategories: ["italian", "osteria", "wine bar"],
    phone: "+13107949111",
    imageUrl: westwoodImage("photo-1467003909585-2f8a72700288"),
    rating: 4.5,
    reviewCount: 410,
    price: "$$$",
    address: "1064 Glendon Ave, Los Angeles, CA 90024",
    coordinates: { lat: 34.0619, lng: -118.4444 },
    averageCheck: 64,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_nanbankan",
    source: "seed",
    externalIds: { googlePlaceId: "seed-nanbankan" },
    name: "Nanbankan",
    cuisineCategories: ["japanese", "yakitori", "izakaya"],
    phone: "+13104781591",
    imageUrl: westwoodImage("photo-1576020799627-aeac74d58064"),
    rating: 4.6,
    reviewCount: 720,
    price: "$$$",
    address: "11330 Santa Monica Blvd, Los Angeles, CA 90025",
    coordinates: { lat: 34.0413, lng: -118.4505 },
    averageCheck: 58,
    neighborhood: "West LA",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_stout_burgers",
    source: "seed",
    externalIds: { googlePlaceId: "seed-stout-burgers-westwood" },
    name: "Stout Burgers & Beers",
    cuisineCategories: ["burgers", "gastropub", "beer"],
    phone: "+13107940020",
    imageUrl: westwoodImage("photo-1568901346375-23c9450c58cd"),
    rating: 4.2,
    reviewCount: 880,
    price: "$$",
    address: "1027 Broxton Ave, Los Angeles, CA 90024",
    coordinates: { lat: 34.0628, lng: -118.4458 },
    averageCheck: 30,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_pinches_tacos",
    source: "seed",
    externalIds: { googlePlaceId: "seed-pinches-tacos-westwood" },
    name: "Pinches Tacos Westwood",
    cuisineCategories: ["mexican", "tacos", "casual"],
    phone: "+13107940099",
    imageUrl: westwoodImage("photo-1565299585323-38d6b0865b47"),
    rating: 4.3,
    reviewCount: 1110,
    price: "$$",
    address: "1062 Glendon Ave, Los Angeles, CA 90024",
    coordinates: { lat: 34.0619, lng: -118.4443 },
    averageCheck: 22,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_sandbar_westwood",
    source: "seed",
    externalIds: { googlePlaceId: "seed-sandbar-westwood" },
    name: "Sandbar Westwood",
    cuisineCategories: ["american", "bar", "late night"],
    phone: "+13104789999",
    imageUrl: westwoodImage("photo-1514933651103-005eec06c04b"),
    rating: 4.1,
    reviewCount: 470,
    price: "$$",
    address: "1133 Westwood Blvd, Los Angeles, CA 90024",
    coordinates: { lat: 34.0594, lng: -118.4435 },
    averageCheck: 34,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_antico_caffe",
    source: "seed",
    externalIds: { googlePlaceId: "seed-antico-caffe-westwood" },
    name: "Antico Caffè Westwood",
    cuisineCategories: ["italian", "cafe", "coffee"],
    phone: "+13104780330",
    imageUrl: westwoodImage("photo-1453614512568-c4024d13c247"),
    rating: 4.4,
    reviewCount: 360,
    price: "$$",
    address: "1099 Westwood Blvd, Los Angeles, CA 90024",
    coordinates: { lat: 34.0599, lng: -118.4435 },
    averageCheck: 26,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_thai_patio",
    source: "seed",
    externalIds: { googlePlaceId: "seed-thai-patio-westwood" },
    name: "Thai Patio Westwood",
    cuisineCategories: ["thai", "noodles", "casual"],
    phone: "+13107948877",
    imageUrl: westwoodImage("photo-1559314809-0d155014e29e"),
    rating: 4.3,
    reviewCount: 690,
    price: "$$",
    address: "1086 Westwood Blvd, Los Angeles, CA 90024",
    coordinates: { lat: 34.0606, lng: -118.4435 },
    averageCheck: 24,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_hugos_tacos",
    source: "seed",
    externalIds: { googlePlaceId: "seed-hugos-tacos-westwood" },
    name: "Hugo's Tacos",
    cuisineCategories: ["mexican", "tacos", "vegetarian-friendly"],
    phone: "+13107941144",
    imageUrl: westwoodImage("photo-1599974579688-8dbdd335c77f"),
    rating: 4.2,
    reviewCount: 1290,
    price: "$$",
    address: "1160 Westwood Blvd, Los Angeles, CA 90024",
    coordinates: { lat: 34.0589, lng: -118.4435 },
    averageCheck: 22,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_diddy_riese",
    source: "seed",
    externalIds: { googlePlaceId: "seed-diddy-riese" },
    name: "Diddy Riese",
    cuisineCategories: ["bakery", "ice cream", "dessert"],
    phone: "+13102090101",
    imageUrl: westwoodImage("photo-1499636136210-6f4ee915583e"),
    rating: 4.7,
    reviewCount: 4520,
    price: "$",
    address: "926 Broxton Ave, Los Angeles, CA 90024",
    coordinates: { lat: 34.0631, lng: -118.4459 },
    averageCheck: 8,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
  {
    _id: "rest_ucla_italia",
    source: "seed",
    externalIds: { googlePlaceId: "seed-ucla-italia" },
    name: "UCLA Italia Trattoria",
    cuisineCategories: ["italian", "trattoria", "wine bar"],
    phone: "+13107941020",
    imageUrl: westwoodImage("photo-1510626176961-4b57d4fbad03"),
    rating: 4.4,
    reviewCount: 280,
    price: "$$$",
    address: "10916 Le Conte Ave, Los Angeles, CA 90024",
    coordinates: { lat: 34.0641, lng: -118.4467 },
    averageCheck: 56,
    neighborhood: "Westwood",
    ownerUserId: "user_sofia",
    ...verifiedSeedClaim,
    ...stamp,
  },
];

export const seedPolicies: RestaurantPolicy[] = seedRestaurants.map((restaurant) => ({
  _id: `policy_${restaurant._id}`,
  restaurantId: restaurant._id,
  confirmationWindowHours: 3,
  finalConfirmationMinutes: 15,
  waitlistRefillEnabled: true,
  peerTransferAllowed: false,
  paidResaleAllowed: false,
  restaurantApprovalRequired: true,
  maxTransferFee: 0,
  feeWaiverIfRefilled: true,
  humanVerificationRequired: true,
  suspiciousAccountAutoReview: true,
  noShowGraceMinutes: 10,
  autoReleaseAfterGracePeriod: false,
  managerApprovalPhone: "+13235550124",
  ...stamp,
}));

export const seedDiners: Diner[] = [
  {
    _id: "diner_daniel",
    userId: "user_daniel",
    name: "Daniel Park",
    phone: "+13235550101",
    email: "daniel@restauranty.demo",
    verifiedHuman: true,
    worldIdNullifierHash: "demo_nullifier_daniel",
    noShowCount: 0,
    lateCancellationCount: 1,
    completedReservations: 14,
    activeReservations: 1,
    trustScore: 81,
    preferredCuisines: ["sushi", "japanese", "italian"],
    homeCoordinates: { lat: 34.09, lng: -118.36 },
    ...stamp,
  },
  {
    _id: "diner_maya",
    userId: "user_maya",
    name: "Maya Chen",
    phone: "+13235550102",
    email: "maya@restauranty.demo",
    verifiedHuman: true,
    worldIdNullifierHash: "demo_nullifier_maya",
    noShowCount: 0,
    lateCancellationCount: 0,
    completedReservations: 8,
    activeReservations: 0,
    trustScore: 94,
    preferredCuisines: ["sushi", "japanese"],
    homeCoordinates: { lat: 34.095, lng: -118.34 },
    ...stamp,
  },
  {
    _id: "diner_jordan",
    name: "Jordan Lee",
    phone: "+13235550103",
    email: "jordan@restauranty.demo",
    verifiedHuman: true,
    noShowCount: 0,
    lateCancellationCount: 0,
    completedReservations: 6,
    activeReservations: 0,
    trustScore: 88,
    preferredCuisines: ["japanese", "korean"],
    homeCoordinates: { lat: 34.08, lng: -118.32 },
    ...stamp,
  },
  {
    _id: "diner_alex",
    name: "Alex Kim",
    phone: "+13235550104",
    email: "alex@restauranty.demo",
    verifiedHuman: false,
    noShowCount: 1,
    lateCancellationCount: 2,
    completedReservations: 1,
    activeReservations: 3,
    trustScore: 42,
    preferredCuisines: ["sushi"],
    homeCoordinates: { lat: 34.12, lng: -118.41 },
    ...stamp,
  },
];

export const seedReservations: Reservation[] = [
  {
    _id: "res_katsuya_815",
    restaurantId: "rest_katsuya",
    dinerId: "diner_daniel",
    source: "seed",
    date: "2026-04-26",
    startTime: "20:15",
    partySize: 2,
    status: "unconfirmed",
    confirmationStatus: "ignored",
    reminderOpened: false,
    reminderSentAt: "2026-04-25T20:15:00.000Z",
    priorLateCancellationsAtBooking: 1,
    priorNoShowsAtBooking: 0,
    cardOnFile: true,
    bookedAt: "2026-04-15T18:24:00.000Z",
    highDemandSlot: true,
    estimatedRevenue: 180,
    cancellationFee: 40,
    riskScore: 82,
    riskLevel: "critical",
    recommendedAction: "send final confirmation and prepare waitlist recovery",
    recoveryStatus: "ready",
    ...stamp,
  },
  {
    _id: "res_bestia_900",
    restaurantId: "rest_bestia",
    dinerId: "diner_jordan",
    source: "seed",
    date: "2026-04-26",
    startTime: "21:00",
    partySize: 4,
    status: "unconfirmed",
    confirmationStatus: "requested",
    reminderOpened: false,
    priorLateCancellationsAtBooking: 0,
    priorNoShowsAtBooking: 0,
    cardOnFile: false,
    bookedAt: "2026-04-20T14:04:00.000Z",
    highDemandSlot: true,
    estimatedRevenue: 410,
    cancellationFee: 60,
    riskScore: 58,
    riskLevel: "medium",
    recommendedAction: "monitor",
    recoveryStatus: "monitoring",
    ...stamp,
  },
  {
    _id: "res_republique_730",
    restaurantId: "rest_republique",
    dinerId: "diner_alex",
    source: "seed",
    date: "2026-04-26",
    startTime: "19:30",
    partySize: 2,
    status: "released_by_diner",
    confirmationStatus: "declined",
    reminderOpened: true,
    priorLateCancellationsAtBooking: 2,
    priorNoShowsAtBooking: 1,
    cardOnFile: false,
    bookedAt: "2026-04-22T12:00:00.000Z",
    highDemandSlot: true,
    estimatedRevenue: 165,
    cancellationFee: 40,
    riskScore: 95,
    riskLevel: "critical",
    recommendedAction: "activate waitlist recovery",
    recoveryStatus: "active",
    ...stamp,
  },
];

export const seedWaitlistCandidates: WaitlistCandidate[] = [
  {
    _id: "wait_maya_katsuya",
    dinerId: "diner_maya",
    restaurantId: "rest_katsuya",
    desiredDate: "2026-04-26",
    desiredTimeWindowStart: "19:30",
    desiredTimeWindowEnd: "21:30",
    partySize: 2,
    distanceMiles: 1.4,
    cuisineMatchScore: 98,
    arrivalEtaMinutes: 18,
    verifiedHuman: true,
    commitmentLevel: "deposit_ready",
    priorityScore: 96,
    status: "available",
    ...stamp,
  },
  {
    _id: "wait_jordan_katsuya",
    dinerId: "diner_jordan",
    restaurantId: "rest_katsuya",
    desiredDate: "2026-04-26",
    desiredTimeWindowStart: "19:00",
    desiredTimeWindowEnd: "21:45",
    partySize: 2,
    distanceMiles: 2.1,
    cuisineMatchScore: 86,
    arrivalEtaMinutes: 24,
    verifiedHuman: true,
    commitmentLevel: "quick_confirm",
    priorityScore: 91,
    status: "available",
    ...stamp,
  },
  {
    _id: "wait_alex_katsuya",
    dinerId: "diner_alex",
    restaurantId: "rest_katsuya",
    desiredDate: "2026-04-26",
    desiredTimeWindowStart: "19:00",
    desiredTimeWindowEnd: "22:00",
    partySize: 2,
    distanceMiles: 4.5,
    cuisineMatchScore: 78,
    arrivalEtaMinutes: 35,
    verifiedHuman: false,
    commitmentLevel: "browsing",
    priorityScore: 42,
    status: "available",
    ...stamp,
  },
];

export const seedRecoveryRequests: RecoveryRequest[] = [
  {
    _id: "recovery_katsuya_815",
    reservationId: "res_katsuya_815",
    restaurantId: "rest_katsuya",
    originalDinerId: "diner_daniel",
    selectedReplacementDinerId: "diner_maya",
    status: "manager_approval_required",
    revenueProtected: 180,
    feeWaived: false,
    startedAt: "2026-04-26T17:12:00.000Z",
    ...stamp,
  },
];

export const seedAgentRuns: AgentRun[] = [
  {
    _id: "run_katsuya_815",
    recoveryRequestId: "recovery_katsuya_815",
    reservationId: "res_katsuya_815",
    status: "completed",
    agentsInvoked: ["RiskAgent", "PolicyAgent", "WaitlistAgent", "FairnessAgent"],
    inputSnapshot: { reservationId: "res_katsuya_815" },
    outputSnapshot: { riskScore: 82, topCandidate: "diner_maya" },
    createdAt: "2026-04-26T17:12:00.000Z",
    completedAt: "2026-04-26T17:13:00.000Z",
  },
];

export const seedAgentLogs: AgentLog[] = [
  {
    _id: "log_risk_1",
    agentRunId: "run_katsuya_815",
    reservationId: "res_katsuya_815",
    agentName: "RiskAgent",
    message: "Scored reservation 82/100 due to ignored confirmation and proximity to seating.",
    severity: "warning",
    status: "completed",
    createdAt: "2026-04-26T17:12:10.000Z",
  },
  {
    _id: "log_waitlist_1",
    agentRunId: "run_katsuya_815",
    reservationId: "res_katsuya_815",
    agentName: "WaitlistAgent",
    message: "Ranked Maya Chen as top verified replacement diner.",
    severity: "success",
    status: "completed",
    createdAt: "2026-04-26T17:12:42.000Z",
  },
];

export const seedAuditLogs: AuditLog[] = [
  {
    _id: "audit_seed_1",
    actorType: "system",
    actorId: "seed",
    action: "seed_demo_data",
    entityType: "system",
    entityId: "restauranty",
    metadata: { source: "seed-data" },
    createdAt: now,
  },
];

export const seedSponsorEvents: SponsorEvent[] = [
  {
    _id: "sponsor_figma_seed",
    sponsor: "figma",
    eventType: "claude_design_specs_referenced",
    payload: { files: 14 },
    createdAt: now,
  },
  {
    _id: "sponsor_cognition_seed",
    sponsor: "cognition",
    eventType: "deterministic_agents_enabled",
    payload: { agents: ["RiskAgent", "PolicyAgent", "WaitlistAgent", "FairnessAgent"] },
    createdAt: now,
  },
];

// ---- Synthetic volume so the dashboard doesn't look empty ---------------

const FIRST_NAMES = [
  "Olivia", "Noah", "Emma", "Liam", "Ava", "Ethan", "Sophia", "Mason",
  "Isabella", "Logan", "Mia", "Lucas", "Charlotte", "Jackson", "Amelia",
  "Aiden", "Harper", "Elijah", "Evelyn", "James", "Abigail", "Benjamin",
  "Emily", "Sebastian", "Madison", "Henry", "Scarlett", "Owen", "Aria",
  "Daniel",
];
const LAST_NAMES = [
  "Nguyen", "Patel", "Garcia", "Kim", "Cohen", "Rivera", "Brooks", "Morales",
  "Lopez", "Reyes", "Wong", "Singh", "Khan", "Ramirez", "Bennett", "Carter",
  "Diaz", "Torres", "Hayes", "Murphy", "Cruz", "Tran", "Foster", "Ortiz",
  "Sullivan",
];
const CUISINE_BUCKETS = [
  ["sushi", "japanese"],
  ["italian", "pizza"],
  ["mexican", "tacos"],
  ["thai", "asian"],
  ["mediterranean", "lebanese"],
  ["american", "burgers"],
  ["persian", "mediterranean"],
];

const DAY_MS = 86_400_000;
function dayOffset(deltaDays: number) {
  const base = new Date("2026-04-26T00:00:00.000Z").getTime();
  return new Date(base + deltaDays * DAY_MS).toISOString().slice(0, 10);
}

const TIME_SLOTS = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

const SYNTHETIC_RESTAURANT_IDS = seedRestaurants.map((r) => r._id);

const extraDiners: Diner[] = Array.from({ length: 30 }, (_, i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[(i * 7 + 3) % LAST_NAMES.length];
  const completed = ((i * 13) % 25) + 1;
  const noShows = i % 11 === 0 ? 2 : i % 6 === 0 ? 1 : 0;
  const lateCancels = i % 8 === 0 ? 2 : i % 4 === 0 ? 1 : 0;
  const trust = Math.max(35, Math.min(98, 95 - noShows * 18 - lateCancels * 6 + (completed > 10 ? 4 : 0)));
  return {
    _id: `diner_synth_${i}`,
    name: `${first} ${last}`,
    phone: `+1310555${String(2000 + i).padStart(4, "0")}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    verifiedHuman: i % 3 !== 0,
    worldIdNullifierHash: i % 3 !== 0 ? `synth_nullifier_${i}` : undefined,
    noShowCount: noShows,
    lateCancellationCount: lateCancels,
    completedReservations: completed,
    activeReservations: i % 5 === 0 ? 2 : 1,
    trustScore: trust,
    preferredCuisines: CUISINE_BUCKETS[i % CUISINE_BUCKETS.length],
    homeCoordinates: { lat: 34.06 + (i % 7) * 0.01, lng: -118.44 + (i % 5) * 0.01 },
    ...stamp,
  };
});

const ALL_DINER_IDS = [
  ...seedDiners.map((d) => d._id),
  ...extraDiners.map((d) => d._id),
];

function syntheticReservation(index: number): Reservation {
  const restaurantId = SYNTHETIC_RESTAURANT_IDS[index % SYNTHETIC_RESTAURANT_IDS.length];
  const dinerId = ALL_DINER_IDS[(index * 11) % ALL_DINER_IDS.length];
  const dayDelta = ((index * 5) % 21) - 7; // -7..+13 days
  const date = dayOffset(dayDelta);
  const startTime = TIME_SLOTS[index % TIME_SLOTS.length];
  const partySize = 2 + (index % 5);

  // status distribution by dayDelta
  let status: Reservation["status"];
  let confirmationStatus: Reservation["confirmationStatus"];
  let riskScore: number;
  let riskLevel: Reservation["riskLevel"];
  let recommendedAction: string;
  let recoveryStatus: string | undefined;

  if (dayDelta < -1) {
    const past = index % 9;
    if (past <= 5) {
      status = "completed";
      confirmationStatus = "confirmed";
      riskScore = 12 + (index % 18);
      riskLevel = "low";
      recommendedAction = "completed";
    } else if (past === 6 || past === 7) {
      status = "cancelled";
      confirmationStatus = "declined";
      riskScore = 40 + (index % 25);
      riskLevel = "medium";
      recommendedAction = "released";
    } else {
      status = "no_show";
      confirmationStatus = "ignored";
      riskScore = 80 + (index % 15);
      riskLevel = "high";
      recommendedAction = "post-mortem";
    }
  } else if (dayDelta === 0) {
    const today = index % 6;
    if (today < 2) {
      status = "unconfirmed";
      confirmationStatus = "ignored";
      riskScore = 60 + (index % 35);
      riskLevel = riskScore >= 85 ? "critical" : "high";
      recommendedAction = riskScore >= 85
        ? "activate waitlist recovery"
        : "send final confirmation";
      recoveryStatus = riskScore >= 85 ? "ready" : "monitoring";
    } else if (today < 4) {
      status = "confirmed";
      confirmationStatus = "confirmed";
      riskScore = 10 + (index % 25);
      riskLevel = "low";
      recommendedAction = "hold";
    } else {
      status = "scheduled";
      confirmationStatus = "requested";
      riskScore = 30 + (index % 30);
      riskLevel = "medium";
      recommendedAction = "monitor";
    }
  } else {
    const upcoming = index % 4;
    if (upcoming === 0) {
      status = "confirmed";
      confirmationStatus = "confirmed";
      riskScore = 8 + (index % 20);
      riskLevel = "low";
      recommendedAction = "hold";
    } else {
      status = "scheduled";
      confirmationStatus = upcoming === 1 ? "requested" : "not_requested";
      riskScore = 20 + (index % 35);
      riskLevel = riskScore >= 50 ? "medium" : "low";
      recommendedAction = "hold";
    }
  }

  const restaurant = seedRestaurants.find((r) => r._id === restaurantId);
  const averageCheck = restaurant?.averageCheck ?? 65;
  const estimatedRevenue = Math.round(averageCheck * partySize);
  const bookedDelta = dayDelta - (3 + (index % 6));
  const bookedAt = `${dayOffset(bookedDelta)}T${TIME_SLOTS[(index + 1) % TIME_SLOTS.length]}:00.000Z`;

  return {
    _id: `res_synth_${index}`,
    restaurantId,
    dinerId,
    source: "seed",
    date,
    startTime,
    partySize,
    status,
    confirmationStatus,
    reminderOpened: index % 4 !== 0,
    priorLateCancellationsAtBooking: index % 7 === 0 ? 1 : 0,
    priorNoShowsAtBooking: index % 13 === 0 ? 1 : 0,
    cardOnFile: index % 3 !== 0,
    bookedAt,
    highDemandSlot: ["19:00", "19:30", "20:00", "20:30"].includes(startTime),
    estimatedRevenue,
    cancellationFee: index % 5 === 0 ? 40 : 0,
    riskScore,
    riskLevel,
    recommendedAction,
    recoveryStatus,
    ...stamp,
  };
}

const extraReservations: Reservation[] = Array.from({ length: 180 }, (_, i) =>
  syntheticReservation(i),
);

seedDiners.push(...extraDiners);
seedReservations.push(...extraReservations);

export const seedDataset = {
  users: seedUsers,
  restaurants: seedRestaurants,
  restaurantPolicies: seedPolicies,
  diners: seedDiners,
  reservations: seedReservations,
  waitlistCandidates: seedWaitlistCandidates,
  recoveryRequests: seedRecoveryRequests,
  agentRuns: seedAgentRuns,
  agentLogs: seedAgentLogs,
  auditLogs: seedAuditLogs,
  sponsorEvents: seedSponsorEvents,
};
