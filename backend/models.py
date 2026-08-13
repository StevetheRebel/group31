from pydantic import BaseModel
from typing import Optional


class OrderResponse(BaseModel):
    order_id: str
    customer_name: str
    product: str
    status: str
    order_date: str
    expected_delivery: Optional[str]


class ProductResponse(BaseModel):
    product_id: str
    name: str
    description: str
    price: float
    stock_quantity: int
    availability: str


class ProductSearchResponse(BaseModel):
    results: list[ProductResponse]