import json
from pathlib import Path


DATA_FILE = Path(__file__).parent.parent / "data" / "products.json"


def load_products():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def calculate_availability(stock_quantity: int) -> str:
    if stock_quantity == 0:
        return "Out of Stock"

    if stock_quantity <= 10:
        return "Low Stock"

    return "In Stock"


def search_products(query: str):
    products = load_products()

    query = query.lower().strip()

    results = []

    for product in products:
        if query in product["name"].lower():
            product_result = product.copy()
            product_result["availability"] = calculate_availability(
                product["stock_quantity"]
            )
            results.append(product_result)

    return results