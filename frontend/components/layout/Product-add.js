"use client";

import { useState } from "react";

const AdminProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
    ratings: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: files,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, we can log the form data. Later, handle image upload and product creation.
    console.log("Form Submitted", formData);
  };

  return (
    <div className="w-full mt-50 max-w-6xl mx-auto p-4 bg-gray-700 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-white">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name and Price */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Product Name
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
            <label htmlFor="price" className="block text-sm font-medium text-white">
              Price
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
            <label htmlFor="description" className="block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="5"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="category" className="block text-sm font-medium text-white">
              Category
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
              <option value="Guitar">Herbal Supplements</option>
              <option value="Piano">Ayurvedic Oils</option>
              <option value="Drums">Personal Care Products</option>
              <option value="Violin">Ayurvedic Teas and Beverages</option>
              <option value="Accessories">Ayurvedic Medicines</option>
            </select>
          </div>
        </div>

        {/* Product Stock and Ratings */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="stock" className="block text-sm font-medium text-white">
              Stock Quantity
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
            <label htmlFor="ratings" className="block text-sm font-medium text-white">
              Ratings (0 to 5)
            </label>
            <input
              type="number"
              id="ratings"
              name="ratings"
              value={formData.ratings}
              onChange={handleInputChange}
              required
              min="0"
              max="5"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Product Images (File Upload) */}
        <div className="form-group">
          <label className="block text-sm font-medium text-white">
            Upload Product Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formData.images.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">Uploaded Images:</h3>
              <ul>
                {formData.images.map((image, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {image.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
         type="submit"
         className="w-full bg-gray-100 text-black text-bold py-3 rounded-md hover:bg-gray-100 hover:text-black"
            >
             Submit
        </button>

      </form>
    </div>
  );
};

export default AdminProductForm;
