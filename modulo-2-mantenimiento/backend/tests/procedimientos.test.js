const request = require("supertest");
const app = require("../app");

describe("API de Procedimientos", () => {

    test("GET /api/procedimientos debe responder 200", async () => {

        const response = await request(app)
            .get("/api/procedimientos");

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);
    });


    test("GET /api/procedimientos/1 debe responder correctamente", async () => {

        const response = await request(app)
            .get("/api/procedimientos/1");

        expect([200, 404]).toContain(response.statusCode);
    });

});