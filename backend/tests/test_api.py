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
    assert data["product"] == "Adidas Samba OG"
    assert data["size"] == 8


def test_unknown_order():
    response = client.get("/api/orders/NS9999")

    assert response.status_code == 404


def test_product_search():
    response = client.get(
        "/api/products/search?query=Nike"
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data["results"]) >= 1


def test_out_of_stock_product():
    response = client.get(
        "/api/products/search?query=Jordan%204"
    )

    assert response.status_code == 200

    product = response.json()["results"][0]

    assert product["stock_quantity"] == 0
    assert product["availability"] == "Out of Stock"


def test_low_stock_product():
    response = client.get(
        "/api/products/search?query=Samba"
    )

    assert response.status_code == 200

    product = response.json()["results"][0]

    assert product["stock_quantity"] == 5
    assert product["availability"] == "Low Stock"


def test_in_stock_product():
    response = client.get(
        "/api/products/search?query=Air%20Max"
    )

    assert response.status_code == 200

    product = response.json()["results"][0]

    assert product["availability"] == "In Stock"


def test_unknown_product():
    response = client.get(
        "/api/products/search?query=xyz123"
    )

    assert response.status_code == 404


def test_product_search_by_size():
    response = client.get(
        "/api/products/search?query=Nike%20Air%20Max&size=9"
    )

    assert response.status_code == 200

    results = response.json()["results"]

    assert len(results) == 1
    assert results[0]["name"] == "Nike Air Max 270"
    assert 9 in results[0]["available_sizes"]


def test_product_search_unavailable_size():
    response = client.get(
        "/api/products/search?query=Nike%20Air%20Max&size=12"
    )

    assert response.status_code == 404


def test_product_search_multiple_results():
    response = client.get(
        "/api/products/search?query=Adidas"
    )

    assert response.status_code == 200

    results = response.json()["results"]

    assert len(results) >= 2