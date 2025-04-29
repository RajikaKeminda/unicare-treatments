'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-xl text-gray-600">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-xl text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <Image 
          src="/product.jpg"
          alt={product.name}
          width={300}
          height={300}
          className="rounded-lg object-contain w-full md:w-1/2"
        />

        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="mt-4 text-lg text-red-600 font-semibold">${product.price}</p>
          <p className="text-yellow-500 mt-1">{product.ratings} ★</p>
          <p className="text-sm mt-2 text-gray-500">Stock: {product.stock}</p>
          <p className="text-sm mt-1 text-gray-500">Category: {product.category}</p>

          <div className="mt-6 flex gap-4">
            <button className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Add to Cart
            </button>
            <Link href="/">
              <button className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">
                Back to Store
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
