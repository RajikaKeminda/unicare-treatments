"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { FaBoxOpen, FaTag, FaDollarSign, FaFileAlt, FaCogs, FaCube, FaStar, FaImage } from "react-icons/fa"; // Import the icons

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  ratings: number;
}

const AdminProductForm = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    ratings: 0,
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate name and ratings before sending
    if (!formData.name || formData.name.trim() === "") {
      alert("Product name is required!");
      return;
    }
    if (isNaN(formData.ratings) || formData.ratings < 0 || formData.ratings > 5) {
      alert("Ratings should be between 0 and 5!");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/product/add`, formData, {
        headers: {
          "Content-Type": "application/json", 
        },
      });
      console.log("Product added successfully", response.data);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        ratings: 0,
      });
      setSuccessMessage("Product submitted successfully! 🎉");
      setTimeout(() => setSuccessMessage(""), 3000);  // Hide the message after 3 seconds
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

      {/* Styled Success Message Modal */}
      {successMessage && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-green-100 p-6 rounded-lg text-center w-96">
            <div className="text-lg text-green-600 font-semibold">{successMessage}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name and Price */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              <FaTag className="inline mr-2" /> Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              <FaDollarSign className="inline mr-2" /> Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
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
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={5}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              <FaCogs className="inline mr-2" /> Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Category</option>
              <option value="Herbal Supplements">Herbal Supplements</option>
              <option value="Skincare & Beauty">Skincare & Beauty</option>
              <option value="Hair Care">Hair Care</option>
              <option value="Digestive Health">Digestive Health</option>
              <option value="Massage & Body Oils">Massage & Body Oils</option>
              <option value="therapeutic devices and equipment">therapeutic devices and equipment </option>
            </select>
          </div>
        </div>

        {/* Product Stock and Ratings */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              <FaCube className="inline mr-2" /> Stock Quantity
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="ratings" className="block text-sm font-medium text-gray-700">
              <FaStar className="inline mr-2" /> Ratings (0 to 5)
            </label>
            <input
              type="number"
              id="ratings"
              name="ratings"
              value={isNaN(formData.ratings) ? 0 : formData.ratings} // Ensure a valid number is displayed
              onChange={(e) => {
                const rating = parseFloat(e.target.value);
                if (!isNaN(rating) && rating >= 0 && rating <= 5) {
                  setFormData({
                    ...formData,
                    ratings: rating,
                  });
                }
              }}
              required
              min="0"
              max="5"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
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