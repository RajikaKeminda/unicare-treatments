import Product from "../models/productModel.ts";
import HttpStatusCodes from "../util/statusCodes.ts";
import productServices from "../services/productService.ts";
import { Response, Request } from "express";
import { handleError } from "../util/errorHandler.ts";

export const getAllProducts = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const allProducts = await productServices.getAll();
    res.status(HttpStatusCodes.OK).json({
      success: true,
      products: allProducts,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productServices.findById(id);
    if (!product) {
      res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ success: true, message: "Product not found." });
      return;
    }
    res.status(HttpStatusCodes.OK).json({
      success: true,
      product,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newProduct = await productServices.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      images: req.body.images,
      ratings: req.body.ratings,
      reviews: req.body.reviews,
    });
    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedProduct = await productServices.update({
      id,
      product: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        images: req.body.images,
        ratings: req.body.ratings,
        reviews: req.body.reviews,
      },
    });

    res.status(HttpStatusCodes.OK).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await productServices.findAndDelete(id);
    if (!deletedProduct) {
      res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ success: true, message: "Product not found." });
      return;
    }
    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    handleError(res, error);
  }
};
