# Learning & Blocker Journal – Solo Recon

## Tool / Concept
Webhook verification (HMAC-SHA256) with timestamp-based replay-attack protection, implemented in a Next.js 16 API route (App Router).

## Why this is unfamiliar to me
Until now, I have only ever been a **consumer** of REST APIs—making fetch calls and parsing JSON responses. Being the **receiver** of an HTTP request that carries cryptographic signatures is a completely different paradigm. I am used to Next.js automatically parsing JSON bodies for me, so deliberately reading the raw `request.text()` to preserve the exact byte-for-byte payload for HMAC calculation feels counterintuitive. Furthermore, I have never used Node.js's `crypto.timingSafeEqual` before, and I didn't know that standard equality operators (`===`) are vulnerable to timing attacks in security-critical contexts.

## Time-box
- **Planned time:** 3 hours  
- **Actual time:** 4 hours *(Includes time spent troubleshooting PowerShell vs. Node.js HMAC encoding differences and creating the Node.js test script)*

---

## Resources Consulted
| Time | Resource | Why I used it | What I learned |
| :--- | :--- | :--- | :--- |
| Start | [YouTube: Webhooks for Beginners](https://www.youtube.com/watch?v=XdH3gpcwnoA&t=42524s) | To understand why our team pivoted from polling to webhooks | Webhooks are "reverse APIs" that push data in real-time. This eliminates the 5-minute latency of polling and reduces load on the warehouse server. It flips the complexity from the *caller* to the *receiver*—which is why security/verification is now my job. |
| Early | Next.js App Router Docs (`request.text()`) | I needed to access the raw request body without automatic JSON parsing | Calling `request.json()` early parses and transforms the body, breaking the signature. The raw bytes must be read via `.text()` before any verification happens. |
| Midway | Node.js `crypto` documentation | To implement the HMAC-SHA256 verification securely | The `createHmac` function requires the exact secret and payload. I also learned that `timingSafeEqual` prevents attackers from guessing the signature by measuring response times, but it requires the buffers to be exactly the same length. |
| Midway | [YouTube: Building a Webhooks System](https://www.youtube.com/watch?v=bXY7899m6M8&t=285s) | To learn about best practices for async processing | Webhook receivers should decouple verification from processing. I simulated this with `setTimeout` in my `hasProcessedEvent` and `processStockUpdate` functions, but I now understand that a real queue (e.g., Redis Streams/SQS) is needed for production to handle spikes. |
| Midway | [YouTube: How WebHook Works – System Design](https://www.youtube.com/watch?v=NuHC5uwbFAc) | To understand the broader architectural pattern | Webhooks are not a protocol but a communication pattern with 3 parts: Sender, Receiver, and Events. My prototype successfully implements the Receiver pattern. The video also reinforced that webhooks decouple systems—our stock service can now evolve independently from the warehouse's internal systems. |
| Late | [YouTube: Node JS Full Course 2026](https://www.youtube.com/watch?v=oQaJn6RdA3g) (Relevant sections) | To solidify my understanding of raw HTTP handling and crypto | This reinforced fundamental Node.js patterns: reading request bodies, handling environment variables, structured logging, and the importance of `try/catch` around async I/O to prevent crashing the server. |
| Late | Svix Webhook Verification Docs (via Google) | To confirm standard timestamp tolerance | The industry standard is a 5-minute clock skew tolerance (`300` seconds) to prevent replay attacks while accommodating server time drift. I implemented this in `isTimestamValid`. |
| **Testing Phase** | Node.js `crypto` module (re-visited) | My PowerShell test script was generating incorrect HMAC signatures | PowerShell's `System.Security.Cryptography.HMACSHA256` handles string encoding differently than Node.js, causing signature mismatches. By using Node.js for testing (the same environment as the server), I eliminated the mismatch and got consistent results. |

---

## Build Log
| Time | Action | Result |
| :--- | :--- | :--- |
| T+0 | Scaffolded `src/app/api/webhooks/warehouse/route.ts` with raw body reader (`request.text()`). | Successfully logged the raw string payload to the console. |
| T+30 | Implemented `verifyWarehouseWebhook` in `/lib/verify-webhook.ts` using `createHmac` with the raw body only. | Signature verification *failed* consistently. I realized the hash never matched the test header. |
| T+45 | **Blocker 1**: Discovered the warehouse signs `timestamp + '.' + rawBody`, not just the raw body. Updated the `createHmac.update()` call to use `${timestamp}.${rawBody}`. | Signature verification **passed**. I accepted a valid request successfully. |
| T+60 | Added `isTimestamValid` with a 5-minute tolerance (`TIMESTAMP_TOLERANCE_SECONDS = 300`). | Rejected expired timestamps correctly with a `401` status. |
| T+90 | Implemented `extractSignature` helper to handle headers formatted as `v1=abc123...`. | Successfully stripped the algorithm prefix before comparing the hex hash. |
| T+120 | **Blocker 2**: Tried using `timingSafeEqual` without length checking. | Crashed with `Error: Input buffers must have the same byte length`. Wrapped the call in `try/catch` and added a length check. Fixed the crash. |
| T+150 | Built in-memory `stockCache` (Map) and `processedEvents` (Set) in `webhook-data.ts`. | Duplicate `eventId`s now return `200 { duplicate: true }` without updating stock (idempotency achieved). |
| T+180 | Initial testing with PowerShell: Invalid signature, valid signature, duplicate event. | Invalid signature passed (`401`). Valid request and duplicate **failed** (`401` for both) due to PowerShell HMAC encoding mismatch. |
| T+210 | **Blocker 3**: PowerShell was generating different HMAC signatures than Node.js. | Researched the issue. Discovered that PowerShell's `HMACSHA256` and Node.js `crypto` use different internal string encodings. |
| T+225 | Switched to a Node.js test script (`scripts/test.js`) that uses the **exact same** `crypto` module as the server. | All three tests passed: `401` for invalid, `200` for valid, `200` with `duplicate:true` for duplicate. |
| T+240 | Added run proof screenshots to `/screenshots` folder. | Documentation complete and ready for submission. |

---

## Blockers
| Blocker | Error / Symptom | What I tried | Final fix | Time spent |
| :--- | :--- | :--- | :--- | :--- |
| **HMAC Mismatch** | Computed hash never matched the `x-warehouse-signature` header. | I used `createHmac('sha256', secret).update(rawBody).digest('hex')` assuming they sign the raw body directly. | I re-read the warehouse spec and realized they follow the standard `timestamp + '.' + rawBody` format. I updated the `update()` call to concatenate them using `${timestamp}.${rawBody}`. | 15 mins |
| **`timingSafeEqual` Crash** | `Error: Input buffers must have the same byte length` when an invalid signature was sent. | I assumed `timingSafeEqual` would just return `false` if lengths mismatched. | I wrapped the buffer comparison in a `try/catch` and added an explicit `if (expectedBuffer.length !== suppliedBuffer.length) return false;` check before calling the function. This handles malformed signatures gracefully. | 10 mins |
| **Raw Body Parsing** | I initially used `request.json()` which caused signatures to fail. | I assumed Next.js parsing was safe. | I switched to `request.text()` to preserve the exact byte-for-byte payload. JSON parsing is now done *after* verification in a separate try/catch block. | 5 mins |
| **PowerShell HMAC Mismatch** | PowerShell test script generated signatures that didn't match the server's verification. | Tried to use PowerShell's `HMACSHA256` class with UTF8 encoding. | Switched to a Node.js test script (`scripts/test.js`) using the `crypto` module—the same environment as the server. The signatures now match perfectly. | 15 mins |

---

## Key Learnings from Video Resources
| Video | Key Takeaway | How I Applied It |
| :--- | :--- | :--- |
| **Webhooks for Beginners** | Webhooks are "reverse APIs" that push data in real-time. This shifts complexity from the provider to the receiver. | Our team's pivot eliminates the 5-minute polling delay, but it means my endpoint must now handle security, retries, and idempotency—exactly what I built in this prototype. |
| **Building a Webhooks System** | Webhook endpoints should do *lightning-fast* verification, then push events to a queue for async processing. | My `processStockUpdate` runs asynchronously after verification. I simulated the decoupling with `setTimeout` (simulated I/O), and I now understand why we need a real queue (SQS/Redis) for production to handle warehouse retry storms. |
| **How WebHook Works (System Design)** | Webhooks are a communication pattern decoupling Sender, Receiver, and Event logic. | My system is clearly divided: Warehouse (Sender) -> My API Route (Receiver) -> Stock Cache (Event Processor). This modularity will make our team's code easier to maintain. |
| **Node JS Full Course** (Relevant sections) | Raw HTTP request handling, `crypto` module basics, and environment variable security. | I used `request.text()` to read the raw body, `createHmac` for signing, and stored the secret in `process.env`. I also validated the significance of returning correct HTTP statuses (`2xx` vs `4xx`/`5xx`) to trigger/avoid provider retries. |

---

## Final Prototype State

**What works:**
- The `/api/webhooks/warehouse` endpoint successfully accepts POST requests.
- Verification rejects requests with missing headers (`401`), invalid signatures (`401`), or expired timestamps (`401`).
- Verification accepts valid requests and correctly parses the `StockUpdateEvent` payload.
- The `processStockUpdate` function updates the in-memory `stockCache` Map with the new quantity and `updatedAt` timestamp.
- Idempotency is fully functional: duplicate `eventId`s return `200` with `{ duplicate: true }` without updating the cache again.
- All errors are logged with structured context (eventId, sku, error message).
- **Run proof:** A Node.js test script (`scripts/test.js`) confirms all three scenarios work correctly. Screenshots are saved in `/screenshots/terminal-test-results.png`.

**What does not work (limitations of the solo prototype):**
- **Persistence:** The `stockCache` and `processedEvents` are in-memory (`Map` and `Set`). If the Next.js server restarts, all data is lost. This is acceptable for a solo prototype but must be replaced with Redis/Postgres for the team's production service.
- **Scalability:** There is no message queue. If the warehouse sends 1000 events per second, the `processStockUpdate` function will block the event loop. A queue (e.g., BullMQ, SQS) is required for the final delivery.
- **No Query Endpoint:** The support dashboard cannot yet query the current stock. I have a `getStock` function defined, but the `GET /api/stock/[sku]` route is not built yet.

**What I would improve next (for the team project):**
1. Replace the in-memory `Map` with a Redis client for persistent, high-speed stock lookups.
2. Replace the `Set` idempotency with Redis `SETNX` featuring a 24-hour TTL to handle duplicate webhooks across server restarts.
3. Add a Dead Letter Queue (DLQ) for events that fail processing after 3 retries, so we don't lose data.
4. Build the `GET /api/stock/[sku]` endpoint for the support dashboard.

---

## Evidence of Independent Learning
I built this entire prototype alone, using only documentation, video tutorials, and the warehouse spec draft. I did not ask a teammate to explain the technical solution or debug my code. The blockers I encountered (timestamp concatenation, `timingSafeEqual` length checks, raw body parsing, and PowerShell HMAC encoding differences) were all resolved by reading error messages, consulting documentation, and logically testing my assumptions. 

**Key moment of independent problem-solving:** When PowerShell generated incorrect HMAC signatures, I didn't give up. I recognized that the testing tool must match the server environment. By switching to a Node.js test script using the `crypto` module, I eliminated the mismatch and successfully verified all three scenarios.

I am now prepared to bring this verified webhook pattern back to the team on Day 3 to accelerate the mid-sprint pivot.