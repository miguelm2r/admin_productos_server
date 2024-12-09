//import request from "supertest";
//import server,from "../server";
import { connectDB } from "../server";
import db from "../config/db";

// Creamos nuestros test para probar el codigo

// describe("GET /api", () => {
//   it("should send back a json response", async () => {
//     const res = await request(server).get("/api");
//     // Comprobamos que el status sea 200 que es una llamada correcta
//     expect(res.status).toBe(200);
//     // Comprobamos que sea un json la respuesta
//     expect(res.headers["content-type"]).toMatch(/json/);
//     // Comprobamos que coincida el mensaje
//     //console.log(res.body.msg)
//     expect(res.body.msg).toBe("Desde api");

//     // No debe ser el status 404
//     expect(res.status).not.toBe(404);
//     expect(res.body.msg).not.toBe("desde API");
//   });
// });

// Creamos el mock para simular la falla de la conexion
jest.mock("../config/db");

// Simulamos que falla la conexion a la base de datos
describe("connectDB", () => {
  it("should handle database connection error", async () => {
    jest
      .spyOn(db, "authenticate")
      .mockRejectedValueOnce(
        new Error("Hubo un error al conectar a la base de datos")
      );
    const consoleSpy = jest.spyOn(console, "log");
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Hubo un error al conectar a la base de datos")
    );
  });
});
