'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa'; // Importing search icon

interface Product {
  id: string;
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/products');
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleUpdate = (id: string) => {
    console.log('Update product with id:', id);
    // Implement your update logic here
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8082/api/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center p-5 text-xl">Loading...</div>;

  return (
    <div className="overflow-x-auto px-4 py-5">
      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {/* Search Icon */}
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full border border-gray-300 bg-white rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase">Name</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Description</th>
              <th className="px-6 py-3 text-center font-semibold uppercase">Price</th>
              <th className="px-6 py-3 text-center font-semibold uppercase">Category</th>
              <th className="px-6 py-3 text-center font-semibold uppercase">Stock</th>
              <th className="px-6 py-3 text-center font-semibold uppercase">Ratings</th>
              <th className="px-6 py-3 text-center font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.description}</td>
                <td className="px-6 py-4 text-center">${product.price}</td>
                <td className="px-6 py-4 text-center">{product.category}</td>
                <td className="px-6 py-4 text-center">{product.stock}</td>
                <td className="px-6 py-4 text-center">{product.ratings}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button onClick={() => handleUpdate(product.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded transition">Update</button>
                  <button onClick={() => handleDelete(product.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstrumentTable;
