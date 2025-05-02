"use client";

import { productSchema } from "@/schemas/product-add-schema";

import React, { useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaTag, FaDollarSign, FaFileAlt, FaCogs, FaCube, FaStar, FaImage } from "react-icons/fa";
import { uploadToS3 } from "@/helpers/s3/s3";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  ratings: number;
}

const AdminProductForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      ratings: 0,
    }
  });

  const [file, setFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data: ProductFormData) => {
    try {
      let s3Key = null;
      if (file) {
        const r = await uploadToS3(file);
        s3Key = r;
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/product/add`, { ...data, s3Key }, {
        headers: {
          "Content-Type": "application/json", 
        },
      });
      console.log("Product added successfully", response.data);
      reset();
      setSuccessMessage("Product submitted successfully! 🎉");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error Response Data:", error.response.data);
          alert(`Error: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
          console.error("No response received:", error.request);
          alert("Error: No response from server. Please check your connection or try again later.");
        } else {
          console.error("Error in setting up request:", error.message);
          alert(`Error: ${error.message}`);
        }
      } else {
        console.error("Unexpected Error:", error);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="w-full mt-50 max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-700">
        <FaBoxOpen className="inline mr-2" /> Add New Product
      </h1>

      {successMessage && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-green-100 p-6 rounded-lg text-center w-96">
            <div className="text-lg text-green-600 font-semibold">{successMessage}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Name and Price */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              <FaTag className="inline mr-2" /> Product Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div className="flex-1">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              <FaDollarSign className="inline mr-2" /> Price
            </label>
            <input
              type="text"
              id="price"
              {...register("price")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>
        </div>

        {/* Product Description and Category */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              <FaFileAlt className="inline mr-2" /> Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={5}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>
          <div className="flex-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              <FaCogs className="inline mr-2" /> Category
            </label>
            <select
              id="category"
              {...register("category")}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Category</option>
              <option value="Herbal Supplements">Herbal Supplements</option>
              <option value="Skincare & Beauty">Skincare & Beauty</option>
              <option value="Hair Care">Hair Care</option>
              <option value="Digestive Health">Digestive Health</option>
              <option value="Massage & Body Oils">Massage & Body Oils</option>
              <option value="therapeutic devices and equipment">therapeutic devices and equipment</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
          </div>
        </div>

        {/* Product Stock and Ratings */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              <FaCube className="inline mr-2" /> Stock Quantity
            </label>
            <input
              type="text"
              id="stock"
              {...register("stock")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
          </div>
          <div className="flex-1">
            <label htmlFor="ratings" className="block text-sm font-medium text-gray-700">
              <FaStar className="inline mr-2" /> Ratings (0 to 5)
            </label>
            <input
              type="number"
              id="ratings"
              {...register("ratings", { valueAsNumber: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              max="5"
            />
            {errors.ratings && <p className="text-red-500 text-sm mt-1">{errors.ratings.message}</p>}
          </div>
        </div>

        {/* Product Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            <FaImage className="inline mr-2" /> Product Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFile(file);
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300"
        >
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;