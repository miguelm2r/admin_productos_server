import { Request, Response } from "express";
// Importamos el modelo
import Product from "../models/Product.model";

// req es el request que le envias
// res es response que recibes

// Creamos el get para obtener productos
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      order: [["id", "DESC"]],
    });
    res.json({ data: products });
  } catch (error) {
    console.log(error);
  }
};

// Creamos el get para obtener un producto por id
export const getProductById = async (req: Request, res: Response) => {
  try {
    // extraemos la variable
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      // Si no existe el producto
      res.status(404).json({
        error: "Producto no encontrado",
      });
      return;
    }
    res.json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

// Creamos el post para crear el producto
export const createProduct = async (req: Request, res: Response) => {
  //console.log(req.body);

  /**
  // Extraemos los datos que envian a traves del request
  const product = new Product(req.body);
  //Guardamos en la base de datos
  const savedProduct = await product.save();
  // Devolvemos el producto que se ingreso en la base de datos
  res.json({ data: savedProduct });
  */

  // Forma mas simple
  try {
    const product = await Product.create(req.body);
    // Retornamos un codigo 201
    res.status(201).json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

// Creamos el put para actualizar el producto
export const updateProduct = async (req: Request, res: Response) => {
  try {
    // extraemos la variable
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      // Si no existe el producto
      res.status(404).json({
        error: "Producto no encontrado",
      });
      return;
    }

    //console.log(req.body);
    // Actualizar
    await product.update(req.body);
    await product.save();
    res.json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

// Creamos el patch para actualizar la disponibilidad
// put actualiza el elemento con lo que le envies incluso borrando lo que tenias mientras patch
// reemplaza unicamente lo que envias manteniendo lo demas sin modificar.
// Al usar el metodo update, sequelize nos facilita que no nos borre lo demas aunque usemos put.
export const updateAvailability = async (req: Request, res: Response) => {
  try {
    // extraemos la variable
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      // Si no existe el producto
      res.status(404).json({
        error: "Producto no encontrado",
      });
      return;
    }

    //console.log(req.body);
    // Actualizar la disponibilidad. Lo cambiara al contrario de la que tenga actualmente
    product.availability = !product.dataValues.availability;
    await product.save();

    res.json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

// Eliminamos el producto
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    // extraemos la variable
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      // Si no existe el producto
      res.status(404).json({
        error: "Producto no encontrado",
      });
      return;
    }

    // Eliminamos el producto
    await product.destroy();

    res.json({ data: "Producto eliminado" });
  } catch (error) {
    console.log(error);
  }
};
