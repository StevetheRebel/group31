import { createHmac, timingSafeEqual } from "crypto";

type VerifyWebhookInput = {
  rawBody: string;
  signature: string;
  timestamp: string;
  secret: string;
};

const TIMESTAMP_TOLERANCE_SECONDS = 300;

function isTimestamValid(timestampStr: string): boolean {
  const timestamp = Number(timestampStr);
  if (Number.isNaN(timestamp)) return false;

  const timestampSeconds =
    timestampStr.length === 13 ? Math.floor(timestamp / 1000) : timestamp;

  const nowSeconds = Math.floor(Date.now() / 1000);
  const difference = Math.abs(nowSeconds - timestampSeconds);

  return difference <= TIMESTAMP_TOLERANCE_SECONDS;
}

function extractSignature(signatureHeader: string): string {
  const parts = signatureHeader.split("=");
  if (parts.length === 2 && /^[a-z0-9]+$/i.test(parts[0])) {
    return parts[1];
  }
  return signatureHeader;
}

export function verifyWarehouseWebhook({
  rawBody,
  signature,
  timestamp,
  secret,
}: VerifyWebhookInput): boolean {
  if (!rawBody || !signature || !timestamp || !secret) {
    return false;
  }

  if (!isTimestamValid(timestamp)) {
    return false;
  }

  const suppliedSignature = extractSignature(signature);

  const signedPayload = `${timestamp}.${rawBody}`;

  try {
    const expectedSignature = createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const suppliedBuffer = Buffer.from(suppliedSignature, "hex");

    if (expectedBuffer.length !== suppliedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, suppliedBuffer);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return false;
  }
}
