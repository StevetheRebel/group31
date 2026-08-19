// scripts/test.js
const crypto = require("crypto");

const SECRET = "test_secret_123";
const URL = "http://localhost:3000/api/webhooks/warehouse";

async function runTest(name, payload, forceInvalid = false) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const rawBody = JSON.stringify(payload);
  const signedPayload = `${timestamp}.${rawBody}`;

  // Generate the HMAC signature (same logic as your server)
  let signature = crypto
    .createHmac("sha256", SECRET)
    .update(signedPayload)
    .digest("hex");
  if (forceInvalid) signature = "invalid_hash_123";

  console.log(`\n--- ${name} ---`);
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Signature: ${signature.substring(0, 20)}...`);

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-warehouse-timestamp": timestamp,
        "x-warehouse-signature": signature,
      },
      body: rawBody,
    });

    const responseBody = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(responseBody, null, 2));
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

// TEST 1: Invalid Signature
// runTest(
//   "Test 1: Invalid Signature (Expects 401)",
//   {
//     eventId: "evt_1",
//     sku: "SKU-001",
//     quantity: 10,
//     eventType: "stock.updated",
//     warehouseId: "WH-1",
//     timestamp: "2026-01-01T00:00:00Z",
//   },
//   true,
// );

// TEST 2: Valid Request (Expects 200)
// runTest("Test 2: Valid Request (Expects 200)", {
//   eventId: "evt_2",
//   sku: "SKU-001",
//   quantity: 50,
//   eventType: "stock.updated",
//   warehouseId: "WH-1",
//   timestamp: "2026-01-01T00:00:00Z",
// });

// TEST 3: Duplicate Event (Expects 200 + duplicate:true)
runTest("Test 3: Duplicate Event (Expects 200 + duplicate:true)", {
  eventId: "evt_2",
  sku: "SKU-001",
  quantity: 50,
  eventType: "stock.updated",
  warehouseId: "WH-1",
  timestamp: "2026-01-01T00:00:00Z",
});
