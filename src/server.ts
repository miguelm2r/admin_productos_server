import express from "express";
import router from "./router";
import db from "./config/db";
// Usamos colors para añadir colores a nuestros mensajes de la terminal
import colors from "colors";
// importamos el swagger para la documentacion
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
// Usamos cors para permitir conectarnos desde el cliente
import cors, { CorsOptions } from "cors";
// Usamos morgan
import morgan from "morgan";

// Conectar a base de datos
export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    //console.log(colors.blue("Conexion exitosa a la base de datos"));
  } catch (error) {
    //console.log(error);
    console.log(
      colors.red.bold("Hubo un error al conectar a la base de datos")
    );
  }
}

connectDB();

// Creamos el servidor
const server = express();

// Permitir conexiones con cors
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      // Permitimos que se conecte
      callback(null, true);
    } else {
      // Denegamos la conexion
      callback(new Error("Error de CORS"));
    }
  },
};
server.use(cors(corsOptions));

// Leer datos de formularios
server.use(express.json());

// Para consultar llamadas a la API, tiempos, errores
server.use(morgan("dev"));

// Agregamos el router
server.use("/api/products", router);

// Prueba para ver test
// server.get("/api", (req, res) => {
//   res.json({ msg: "Desde api" });
// });

// Docs
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default server;
