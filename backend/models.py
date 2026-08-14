from pydantic import BaseModel
from typing import Optional


class OrderResponse(BaseModel):
    order_id: str
    customer_name: str
    product: str
    size: int
    status: str
    order_date: str
    expected_delivery: Optional[str]


class ProductResponse(BaseModel):
    product_id: str
    name: str
    category: str
    description: str
    price: float
    available_sizes: list[int]
    stock_quantity: int
    availability: str


class ProductSearchResponse(BaseModel):
    results: list[ProductResponse]