export type StockUpdateEvent = {
  eventId: string;
  eventType: "stock.updated" | "stock.created" | "stock.deleted";
  sku: string;
  quantity: number;
  warehouseId: string;
  timestamp: string;
  version?: number;
};

export type StockItem = {
  sku: string;
  warehouseId: string;
  quantity: number;
  updatedAt: string;
  version?: number;
};

const processedEvents = new Set<string>();

const stockCache = new Map<string, StockItem>();

stockCache.set("SKU-001", {
  sku: "SKU-001",
  warehouseId: "WH-1",
  quantity: 100,
  updatedAt: new Date().toISOString(),
  version: 1,
});
stockCache.set("SKU-002", {
  sku: "SKU-002",
  warehouseId: "WH-1",
  quantity: 50,
  updatedAt: new Date().toISOString(),
  version: 1,
});

export async function hasProcessedEvent(eventId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 5));

  return processedEvents.has(eventId);
}

export async function processStockUpdate(
  event: StockUpdateEvent,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 10));

  if (processedEvents.has(event.eventId)) {
    return;
  }

  switch (event.eventType) {
    case "stock.updated":
    case "stock.created": {
      const existing = stockCache.get(event.sku);
      const newVersion = event.version ?? (existing?.version ?? 0) + 1;

      stockCache.set(event.sku, {
        sku: event.sku,
        warehouseId: event.warehouseId,
        quantity: event.quantity,
        updatedAt: event.timestamp || new Date().toISOString(),
        version: newVersion,
      });
      break;
    }

    default:
      throw new Error(`Unknown event type: ${event.eventType}`);
  }

  processedEvents.add(event.eventId);

  await new Promise((resolve) => setTimeout(resolve, 5));
}

export async function getStock(sku?: string): Promise<StockItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 5))

    if (sku) {
        const item = stockCache.get(sku);
        return item ? [item] : []

    }

    return Array.from(stockCache.values())
}