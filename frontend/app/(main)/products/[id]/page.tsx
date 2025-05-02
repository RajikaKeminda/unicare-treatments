'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronLeft } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  stock?: number;
  sku?: string;
  rating?: number;
  reviewCount?: number;
  originalPrice?: number;
  s3Key?: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        setError('Failed to load product details' + err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="text-center mt-10 text-xl text-red-500">
      {error}
      <Link href="/" className="block mt-4 text-blue-600 hover:underline">
        Return to homepage
      </Link>
    </div>
  );

  if (!product) return null;

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'}`}
      />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/products/product-view" className="flex items-center text-gray-600 hover:text-primary mb-6">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Store
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-8 flex items-center justify-center">
          <Image
            src={product?.s3Key || "/product.jpg"}
            alt={product.name}
            width={500}
            height={500}
            className="object-contain w-full h-auto"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderStars(product.rating || 0)}
            </div>
            <span className="text-sm text-gray-500">
              {product.reviewCount || 0} reviews
            </span>
          </div>

          {product.originalPrice && (
            <p className="text-lg text-gray-500 line-through mb-1">
              ${product.originalPrice.toFixed(2)}
            </p>
          )}

          <p className="text-3xl font-bold text-gray-900 mb-6">
            ${product.price.toFixed(2)}
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Details</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Category: {product.category}</li>
              <li>Stock: {product.stock} units available</li>
              {product.sku && <li>SKU: {product.sku}</li>}
            </ul>
          </div>

          <div className="flex items-center mb-6">
            <label htmlFor="quantity" className="mr-4 text-gray-700">Quantity:</label>
            <div className="flex border border-gray-300 rounded-md">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-primary hover:bg-red-900 text-white bg-red-500 py-3 px-6 rounded-lg font-medium transition-colors">
              Add to Cart
            </button>

            <Link href={`/products/order/${product._id}`} passHref>
            <button className="flex-1  hover:bg-blue-900 text-white  bg-blue-500 py-3 px-6 rounded-lg font-medium transition-colors">
              Buy Now
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
