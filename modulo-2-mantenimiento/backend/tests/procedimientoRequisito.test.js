const request = require("supertest");
const app = require("../app");

describe("API Procedimiento-Requisito", () => {

    test("GET /api/procedimiento-requisito debe responder 200", async () => {

        const response = await request(app)
            .get("/api/procedimiento-requisito");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET requisitos de un procedimiento debe responder correctamente", async () => {

        const response = await request(app)
            .get("/api/procedimiento-requisito/procedimiento/1");

        expect([200, 404]).toContain(response.statusCode);
    });

});