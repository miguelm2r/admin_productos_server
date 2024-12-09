import { Request, Response, NextFunction } from "express";
// Importamos el validator
import { validationResult } from "express-validator";

// Creamos el middleware
export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //console.log("desde middleware");

  // Comprobamos si tenemos algun error en el formulario
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  // next lo usamos para pasar a la siguiente funcion
  next();
};
