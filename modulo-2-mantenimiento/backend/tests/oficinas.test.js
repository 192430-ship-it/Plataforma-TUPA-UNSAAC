const request = require("supertest");
const app = require("../app");

describe("API de Oficinas", () => {

    test("GET /api/oficinas debe responder 200", async () => {

        const response = await request(app)
            .get("/api/oficinas");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /api/oficinas/1 debe responder correctamente", async () => {

        const response = await request(app)
            .get("/api/oficinas/1");

        expect([200, 404]).toContain(response.statusCode);
    });

});