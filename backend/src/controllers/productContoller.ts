import { Request, Response } from 'express';
import Product from '../models/productModel.ts';

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, category, stock, ratings } = req.body;

  try {
    // Create a new product and save it to the database
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      ratings,
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find(); // Fetch products from DB
    res.status(200).json({
      message: 'Products retrieved successfully',
      products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};
