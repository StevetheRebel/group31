from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_valid_order():
    response = client.get("/api/orders/NS1003")

    assert response.status_code == 200

    data = response.json()

    assert data["order_id"] == "NS1003"
    assert data["status"] == "Shipped"


def test_unknown_order():
    response = client.get("/api/orders/NS9999")

    assert response.status_code == 404


def test_product_search():
    response = client.get(
        "/api/products/search?query=keyboard"
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data["results"]) >= 1


def test_out_of_stock_product():
    response = client.get(
        "/api/products/search?query=mouse"
    )

    assert response.status_code == 200

    product = response.json()["results"][0]

    assert product["stock_quantity"] == 0
    assert product["availability"] == "Out of Stock"


def test_low_stock_product():
    response = client.get(
        "/api/products/search?query=hub"
    )

    assert response.status_code == 200

    product = response.json()["results"][0]

    assert product["stock_quantity"] == 7
    assert product["availability"] == "Low Stock"


def test_in_stock_product():
    response = client.get(
        "/api/products/search?query=monitor"
    )

    assert response.status_code == 200

    product = response.json()["results"][0]

    assert product["availability"] == "In Stock"


def test_unknown_product():
    response = client.get(
        "/api/products/search?query=xyz123"
    )

    assert response.status_code == 404