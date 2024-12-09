import request from "supertest";
import server from "../../server";

// Comprobando el crear producto
describe("POST /api/products", () => {
  it("should display validation errors", async () => {
    // validamos que al enviar vacio el form nos de error
    const response = await request(server).post("/api/products").send({});
    // Esperamos que sea 400 la respuesta del status
    expect(response.status).toBe(400);
    // Esperamos que contenga errores
    expect(response.body).toHaveProperty("errors");
    // Validamos la extension de errores
    expect(response.body.errors).toHaveLength(4);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monito - test",
      price: 0,
    });
    // Esperamos que sea 400 la respuesta del status
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
  });

  it("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Mouse - testing",
      price: 50,
    });

    // Esperamos que sea 201 la respuesta del status
    expect(response.status).toBe(201);
    // Esperamos que tenga el objeto de data
    expect(response.body).toHaveProperty("data");

    // Esperamos que no sea 404 la respuesta del status
    expect(response.status).not.toBe(404);
    // Esperamos que no tenga el objeto de error
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/products", () => {
  it("should check if api/products url exists", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).not.toBe(404);
  });

  it("GET a JSON response with products", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveLength(1);

    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/products/:id", () => {
  it("Should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server).get(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");
  });

  it("Should check a valid ID in the URL", async () => {
    const response = await request(server).get(`/api/products/not-valid-url`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("ID no válido");
  });

  it("Get a JSON response for a single product", async () => {
    const response = await request(server).get(`/api/products/1`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

describe("PUT /api/products/:id", () => {
  it("Should check a valid ID in the URL", async () => {
    const response = await request(server)
      .put(`/api/products/not-valid-url`)
      .send({
        name: "Monitor -test",
        availability: true,
        price: 300,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("ID no válido");
  });

  it("Should display validation error messages when updating a product", async () => {
    // Enviamos un objeto vacio
    const response = await request(server).put(`/api/products/1`).send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(5);

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("Should validate that the price is greater than 0", async () => {
    // Enviamos un objeto con el precio negativo
    const response = await request(server).put(`/api/products/1`).send({
      name: "Monitor -test",
      availability: true,
      price: -300,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("El precio debe ser mayor a 0");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("Should return a 404 response for a non-existent product", async () => {
    // Enviamos un objeto con el precio negativo
    const response = await request(server).put(`/api/products/500`).send({
      name: "Monitor -test",
      availability: true,
      price: 300,
    });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("Should update an existent product with valid data", async () => {
    // Enviamos un objeto con el precio negativo
    const response = await request(server).put(`/api/products/1`).send({
      name: "Monitor -test",
      availability: true,
      price: 300,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("PATCH /api/products/:id", () => {
  it("Should return a 404 response for a non-existing product", async () => {
    const response = await request(server).patch(`/api/products/5000`).send({
      availability: true,
    });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");
  });

  it("Should update the product availability", async () => {
    const response = await request(server).patch(`/api/products/1`).send({
      availability: true,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

describe("DELETE /api/products/:id", () => {
  it("Should check a valid ID", async () => {
    const response = await request(server).delete("/api/products/not-valid");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("ID no válido");
  });

  it("Should return a 404 response for a non-existent product", async () => {
    const response = await request(server).delete("/api/products/5000");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");
  });

  it("Should delete a product", async () => {
    const response = await request(server).delete("/api/products/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBe("Producto eliminado");
  });
});
