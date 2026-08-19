import {
  hasProcessedEvent,
  processStockUpdate,
} from "@/src/features/stock/data/webhook-data";
import { verifyWarehouseWebhook } from "@/src/features/stock/lib/verify-webhook";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type StockUpdateEvent = {
  eventId: string;
  eventType: "stock.updated" | "stock.created" | "stock.deleted";
  sku: string;
  quantity: number;
  warehouseId: string;
  timestamp: string;
  version?: number;
};

export async function POST(request: Request) {
  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch (error) {
    console.error("Unable to read webhook body", error);
    return NextResponse.json({ error: "Unable to read body" }, { status: 400 });
  }

  const signature = request.headers.get("x-warehouse-signature");
  const timestamp = request.headers.get("x-warehouse-timestamp");

  if (!signature || !timestamp) {
    return NextResponse.json(
      { error: "Missing signature headers" },
      { status: 401 },
    );
  }

  const secret = process.env.WAREHOUSE_WEBHOOK_SECRET;

  if (!secret) {
    console.error("Warehouse_webhook_secret is not set");
    return NextResponse.json(
      { error: "Webhook verification is not configured" },
      { status: 500 },
    );
  }

  const isValid = verifyWarehouseWebhook({
    rawBody,
    signature,
    timestamp,
    secret,
  });

  if (!isValid) {
    console.warn("Invalid warehouse webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: StockUpdateEvent;

  try {
    payload = JSON.parse(rawBody) as StockUpdateEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !payload.eventId ||
    !payload.sku ||
    typeof payload.quantity !== "number" ||
    !payload.eventType
  ) {
    return NextResponse.json(
      {
        error: "Missing required fields",
      },
      { status: 400 },
    );
  }

  const alreadyProcessed = await hasProcessedEvent(payload.eventId);

  if (alreadyProcessed) {
    return NextResponse.json(
      { received: true, duplicate: true },
      { status: 200 },
    );
  }

  try {
    await processStockUpdate(payload);
  } catch (error) {
    console.error("Failed to process stock update", {
      eventId: payload.eventId,
      sku: payload.sku,
      error,
    });
    return NextResponse.json(
      { error: "Failed to process event" },
      { status: 500 },
    );
  }

  return NextResponse.json({ recieved: true }, { status: 200 });
}
