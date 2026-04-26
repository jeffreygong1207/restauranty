import { sendConfirmationMessage } from "@/lib/services/twilio";
import type { Diner, Reservation, Restaurant } from "@/lib/types";

export function confirmationMessage(input: {
  dinerName: string;
  restaurantName: string;
  startTime: string;
  partySize: number;
}) {
  return `Hi ${input.dinerName}, are you still coming to ${input.restaurantName} at ${input.startTime} for ${input.partySize}? Reply CONFIRM or RELEASE. If released and refilled, your cancellation fee may be waived according to restaurant policy.`;
}

export async function runConfirmationAgent(input: {
  reservation: Reservation;
  diner: Diner;
  restaurant: Restaurant;
}) {
  const message = confirmationMessage({
    dinerName: input.diner.name,
    restaurantName: input.restaurant.name,
    startTime: input.reservation.startTime,
    partySize: input.reservation.partySize,
  });
  return sendConfirmationMessage({
    to: input.diner.phone,
    message,
    reservationId: input.reservation._id,
  });
}
