import { IProduct } from "../types/product.ts";

import Product from "../models/productModel.ts";

async function getAll() {
  const allProducts = await Product.find();
  return allProducts;
}

async function findById(id: string) {
  const product = await Product.findById(id);
  return product;
}

async function create(product: IProduct) {
  const newProduct = new Product({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    stock: product.stock,
    images: product.images,
    ratings: product.ratings,
    reviews: product.reviews,
  });
  await newProduct.save();
  return newProduct;
}

async function update({ id, product }: { id: string; product: IProduct }) {
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images,
      ratings: product.ratings,
      reviews: product.reviews,
    },
    { new: true }
  );
  return updatedProduct;
}

async function findAndDelete(id: string) {
  const deletedProduct = await Product.findByIdAndDelete(id);
  return deletedProduct;
}

export default {
  getAll,
  findById,
  create,
  update,
  findAndDelete,
};