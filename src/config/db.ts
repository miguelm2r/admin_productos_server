import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

// Usamos las variables de entorno
dotenv.config();

// Creamos la base de datos
// Hay que incluirle al final ?ssl=true en el .env
// Al final incluimos un ! para garantizar que exista el valor
// Con models le decimos donde encontrara los modelos para la base de datos
// Con logging evitamos que envie datos a la consola y nos de error el test
const db = new Sequelize(process.env.DATABASE_URL!, {
  models: [__dirname + "/../models/**/*.ts"],
  logging: false,
});

export default db;
