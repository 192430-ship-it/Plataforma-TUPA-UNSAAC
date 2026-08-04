const request = require("supertest");
const app = require("../app");

describe("API de Requisitos", () => {

    test("GET /api/requisitos debe responder 200", async () => {

        const response = await request(app)
            .get("/api/requisitos");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /api/requisitos/1 debe responder correctamente", async () => {

        const response = await request(app)
            .get("/api/requisitos/1");

        expect([200, 404]).toContain(response.statusCode);
    });

});