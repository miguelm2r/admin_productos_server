import server from "./server";
import colors from "colors";

// Iniciamos el servidor en el puerto 4000 o en la variable que nos asignen
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(colors.cyan.bold(`REST API en el puerto ${port}`));
});
