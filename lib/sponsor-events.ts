import { addSponsorEvent } from "@/lib/repositories/sponsorEvents";
import type { SponsorEvent } from "@/lib/types";

export async function sponsorEvent(input: Omit<SponsorEvent, "_id" | "createdAt">) {
  return addSponsorEvent(input);
}
