import json
from pathlib import Path


DATA_FILE = Path(__file__).parent.parent / "data" / "orders.json"


def load_orders():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def get_order(order_id: str):
    orders = load_orders()

    for order in orders:
        if order["order_id"].lower() == order_id.lower():
            return order

    return None