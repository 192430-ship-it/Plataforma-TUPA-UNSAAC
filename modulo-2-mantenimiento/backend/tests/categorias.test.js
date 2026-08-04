const request = require("supertest");
const app = require("../app");

describe("API de Categorías", () => {

    test("GET /api/categorias debe responder 200", async () => {

        const response = await request(app)
            .get("/api/categorias");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /api/categorias/1 debe responder correctamente", async () => {

        const response = await request(app)
            .get("/api/categorias/1");

        expect([200, 404]).toContain(response.statusCode);
    });

});