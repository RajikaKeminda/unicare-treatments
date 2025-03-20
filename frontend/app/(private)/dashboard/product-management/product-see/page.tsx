'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  ratings: number;
}

const InstrumentTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Product>({
    _id: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    ratings: 0,
  });

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/products`);
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle product update form open
  const handleUpdate = (product: Product) => {
    setEditProduct(product);
    setUpdatedProduct(product); // Pre-fill the update form
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update product on backend
  const handleSaveUpdate = async () => {
    try {
      const { _id, name, description, price, category, stock, ratings } = updatedProduct;
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${_id}`, {
        name,
        description,
        price,
        category,
        stock,
        ratings,
      });
      setProducts((prev) =>
        prev.map((product) =>
          product._id === _id ? { ...product, ...updatedProduct } : product
        )
      );
      console.log('Product updated successfully');
      setEditProduct(null); // Close edit form
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Available Products Report', 20, 20);

    // Move this to generatePDF to ensure it's client-side only
    const currentDate = new Date().toLocaleDateString(); 

    doc.setFontSize(12);
    doc.text(`Date: ${currentDate}`, 20, 30);

    let yPosition = 40;
    const rowHeight = 10;
    const columnWidths = [40, 60, 30, 40];

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.rect(20, yPosition, columnWidths[0], rowHeight);
    doc.rect(20 + columnWidths[0], yPosition, columnWidths[1], rowHeight);
    doc.rect(20 + columnWidths[0] + columnWidths[1], yPosition, columnWidths[2], rowHeight);
    doc.rect(20 + columnWidths[0] + columnWidths[1] + columnWidths[2], yPosition, columnWidths[3], rowHeight);
    doc.text('Name', 25, yPosition + 6);
    const descriptionX = 20 + columnWidths[0] + (columnWidths[1] - doc.getTextWidth('Description')) / 2;
    doc.text('Description', descriptionX, yPosition + 6);
    const priceX = 20 + columnWidths[0] + columnWidths[1] + (columnWidths[2] - doc.getTextWidth('Price')) / 2;
    doc.text('Price', priceX, yPosition + 6);
    doc.text('Category', 160, yPosition + 6);

    yPosition += rowHeight;

    filteredProducts.forEach((product) => {
      doc.rect(20, yPosition, columnWidths[0], rowHeight);
      doc.rect(20 + columnWidths[0], yPosition, columnWidths[1], rowHeight);
      doc.rect(20 + columnWidths[0] + columnWidths[1], yPosition, columnWidths[2], rowHeight);
      doc.rect(20 + columnWidths[0] + columnWidths[1] + columnWidths[2], yPosition, columnWidths[3], rowHeight);
      doc.text(product.name, 25, yPosition + 6);
      const descriptionXData = 20 + columnWidths[0] + (columnWidths[1] - doc.getTextWidth(product.description)) / 2;
      doc.text(product.description, descriptionXData, yPosition + 6);
      const priceXData = 20 + columnWidths[0] + columnWidths[1] + (columnWidths[2] - doc.getTextWidth(`$${product.price.toFixed(2)}`)) / 2;
      doc.text(`$${product.price.toFixed(2)}`, priceXData, yPosition + 6);
      doc.text(product.category, 160, yPosition + 6);
      yPosition += rowHeight;
    });

    doc.save('products-report.pdf');
  };

  if (loading) return <div className="text-center p-5 text-xl">Loading...</div>;

  return (
    <div className="overflow-x-auto px-4 py-5">
      <div className="mb-4 flex justify-between items-center flex-wrap">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        <button
          onClick={generatePDF}
          className="mt-4 sm:mt-0 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Generate Report
        </button>
      </div>

      {/* Product Update Form */}
      {editProduct && (
        <div className="mb-4 p-5 bg-white rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Update Product</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveUpdate(); }}>
            <div className="mb-4">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={updatedProduct.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={updatedProduct.description}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={updatedProduct.price}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={updatedProduct.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={updatedProduct.stock}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label>Ratings</label>
              <input
                type="number"
                name="ratings"
                value={updatedProduct.ratings}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
        <thead>
          <tr>
            <th className="py-3 px-6 border-b">Name</th>
            <th className="py-3 px-6 border-b">Category</th>
            <th className="py-3 px-6 border-b">Price</th>
            <th className="py-3 px-6 border-b">Stock</th>
            <th className="py-3 px-6 border-b">Ratings</th>
            <th className="py-3 px-6 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td className="py-3 px-6 border-b">{product.name}</td>
              <td className="py-3 px-6 border-b">{product.category}</td>
              <td className="py-3 px-6 border-b">${product.price}</td>
              <td className="py-3 px-6 border-b">{product.stock}</td>
              <td className="py-3 px-6 border-b">{product.ratings}</td>
              <td className="px-6 py-4 text-center flex justify-center space-x-4">
                <button
                  onClick={() => handleUpdate(product)}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstrumentTable;