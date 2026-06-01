import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { createUser } from "@/lib/db/users";

/**
 * Handles Clerk webhook events.
 * On user.created, syncs the new user to the local database.
 *
 * @returns 200 if the webhook was processed, 400 if verification fails or userId is missing.
 */
export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // retrieve id and eventType from payload
    const { id } = evt.data;
    const eventType = evt.type;

    // log receipt and payload
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`,
    );
    console.log("Webhook payload:", evt.data);

    switch (eventType) {
      // sync new Clerk user to db
      case "user.created":
        if (!id) {
          console.error("Missing user id in webhook payload");
          return new Response("Missing user id", { status: 400 });
        }
        // email_addresses is a list - take the primary one
        const userEmail = evt.data.email_addresses[0]?.email_address;

        await createUser(id, userEmail);
        console.log("User created in db: " + id);

        break;
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
