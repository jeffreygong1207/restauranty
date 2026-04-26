import { boolEnv, env } from "@/lib/env";
import { audit } from "@/lib/audit";
import { id, isoNow } from "@/lib/repositories/store";
import { getDb } from "@/lib/db";
import { COLLECTIONS } from "@/lib/constants";
import type { NotificationEvent } from "@/lib/types";

export async function sendConfirmationMessage(input: {
  to: string;
  message: string;
  reservationId: string;
}) {
  const realSms =
    boolEnv("ENABLE_REAL_SMS") &&
    env("TWILIO_ACCOUNT_SID") &&
    env("TWILIO_AUTH_TOKEN") &&
    env("TWILIO_PHONE_NUMBER");

  let event: NotificationEvent;
  if (realSms) {
    const auth = Buffer.from(`${env("TWILIO_ACCOUNT_SID")}:${env("TWILIO_AUTH_TOKEN")}`).toString("base64");
    const body = new URLSearchParams({
      To: input.to,
      From: env("TWILIO_PHONE_NUMBER")!,
      Body: input.message,
    });
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${env("TWILIO_ACCOUNT_SID")}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );
    event = {
      _id: id("notification"),
      provider: "twilio",
      recipient: input.to,
      message: input.message,
      status: response.ok ? "sent" : "failed",
      metadata: { reservationId: input.reservationId, status: response.status },
      createdAt: isoNow(),
    };
  } else {
    event = {
      _id: id("notification"),
      provider: "simulated",
      recipient: input.to,
      message: input.message,
      status: "simulated",
      metadata: { reservationId: input.reservationId, reason: "Real SMS disabled or not configured" },
      createdAt: isoNow(),
    };
  }

  const db = await getDb();
  if (db) await db.collection(COLLECTIONS.notificationEvents).insertOne(event as never);
  await audit({
    actorType: realSms ? "external_api" : "system",
    actorId: realSms ? "twilio" : "simulated",
    action: "confirmation_message_created",
    entityType: "reservation",
    entityId: input.reservationId,
    after: event,
  });
  return {
    provider: event.provider,
    status: event.status,
    notificationId: event._id,
  };
}
