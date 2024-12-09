import { exit } from "node:process";
import db from "../config/db";

// Limpiamos la base de datos. Esto para la hora de hacer test
const clearDB = async () => {
  try {
    // eliminamos los datos
    await db.sync({ force: true });
    console.log("Datos eliminados correctamente");
    exit();
  } catch (error) {
    console.log(error);
    // al finalizar con 1 le decimos que finalizo con errores
    exit(1);
  }
};

// Si al llamar en npm le incluimos --clear limpia la base de datos
if (process.argv[2] === "--clear") {
  clearDB();
}
