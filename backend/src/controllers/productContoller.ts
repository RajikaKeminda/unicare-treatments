import { Request, Response } from 'express';
import Product from '../models/productModel.ts';
import { promises } from 'dns';

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, category, stock, ratings } = req.body;

  try {
    // Create a new product and save it to the database
    const productData: any = {
      name,
      price,
      category,
      stock,
      ratings,
    };

    // Add description to the product data only if it's not an empty string
    if (description && description.trim() !== '') {
      productData.description = description;
    }

    const newProduct = new Product(productData);

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


// Delete Product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, price, category, stock, ratings } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, category, stock, ratings },
      { new: true }
    );
    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};