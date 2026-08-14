from fastapi import FastAPI, HTTPException, Query

from models import OrderResponse, ProductSearchResponse
from services.order_service import get_order
from services.product_service import search_products


app = FastAPI(
    title="Northstar Support API",
    description="Backend API for Northstar Retail's Support Deflection MVP",
    version="1.0.0",
)


@app.get("/")
def home():
    return {
        "message": "Northstar Support API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get(
    "/api/orders/{order_id}",
    response_model=OrderResponse
)
def get_order_status(order_id: str):
    order = get_order(order_id)

    if order is None:
        raise HTTPException(
            status_code=404,
            detail=f"Order '{order_id}' was not found."
        )

    return order


@app.get(
    "/api/products/search",
    response_model=ProductSearchResponse
)
def search_product(
    query: str = Query(
        ...,
        min_length=1,
        description="Product name or keyword to search for"
    ),
    size: int | None = Query(
        None,
        ge=1,
        description="Optional shoe size filter"
    )
):
    results = search_products(query, size)

    if not results:
        raise HTTPException(
            status_code=404,
            detail="No products found matching the search criteria."
        )

    return {
        "results": results
    }