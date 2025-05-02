'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import Link from 'next/link';
import axios from 'axios';

const HeaderAndProducts = () => {
  const [filter, setFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/products`);
        console.log('API Response:', response);
        
        let productsData = [];
        if (Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response.data && response.data.products) {
          productsData = response.data.products;
        } else {
          throw new Error('Data is not in expected array format');
        }

        setProducts(productsData);
        
        // Group products by category
        const grouped = productsData.reduce((acc, product) => {
          const category = product.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});

        setGroupedProducts(grouped);
        
      } catch (error) {
        setError('Failed to fetch products');
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Update cart count from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(savedCart.length);
  }, []);

  // Filter products based on search input and active category
  const getFilteredProducts = () => {
    let productsToFilter = [];
    
    if (activeCategory === 'All') {
      productsToFilter = products;
    } else {
      productsToFilter = groupedProducts[activeCategory] || [];
    }
    
    if (filter) {
      return productsToFilter.filter(product =>
        product.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    return productsToFilter;
  };

  const filteredProducts = getFilteredProducts();

  const addToCart = (product) => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const productExists = savedCart.some(item => item._id === product._id);
    
    if (!productExists) {
      savedCart.push({ ...product, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(savedCart));
      setCartCount(savedCart.length);
    } else {
      alert('This product is already in your cart!');
    }
  };

  // Get all available categories
  const categories = ['All', ...Object.keys(groupedProducts)];

  return (
    <div>
      {/* Header Section - kept exactly the same */}
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-wrap items-center justify-between px-4 md:flex-nowrap">
          <div className="flex-shrink-0 md:ml-0 w-full md:w-auto flex justify-center md:justify-start">
            <Image 
              src="/logo-bg-removed2.png" 
              alt="Logo" 
              width={180} height={80} 
              className="w-32 md:w-[230px]" 
              unoptimized 
            />
          </div>

          {/* Search Bar */}
          <div className="flex items-center w-full max-w-sm border rounded-full focus-within:shadow-md mt-3 md:mt-0">
            <input
              type="text"
              placeholder="Search product here..."
              value={filter || ''}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full h-10 outline-none rounded-l-full pl-3 text-black"
            />
            <div className="text-lg min-w-[50px] h-10 bg-red-600 flex items-center justify-center rounded-r-full text-white">
              <GrSearch />
            </div>
          </div>

          {/* User and Cart Icons */}
          <div className="flex items-center gap-5 md:gap-7 mt-3 md:mt-0">
            <div className="text-3xl cursor-pointer">
              <FaRegCircleUser />
            </div>

            <Link href="/shopping-cart">
              <div className="text-2xl relative">
                <span><FaShoppingCart /></span>
                <div className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center absolute -top-2 -right-3 text-xs">
                  {cartCount}
                </div>
              </div>
            </Link>

            <Link href="/products/order-see" passHref className="text-2xl relative">
              <span><FiPackage /></span>
              <span className="sr-only">View Orders</span>
            </Link>

            <div className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700 hidden sm:block'>
              Ayurveda products
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter - Added below the header */}
      <div className="p-4 bg-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeCategory === category 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading, Error, and Product Display */}
      <section className="relative p-4">
        {loading ? (
          <div className="text-center text-xl text-gray-700">Loading products...</div>
        ) : error ? (
          <div className="text-center text-xl text-red-600">{error}</div>
        ) : (
          <>
            {/* Show category heading if not showing all products */}
            {activeCategory !== 'All' && (
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {activeCategory} ({filteredProducts.length} products)
              </h2>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center text-xl text-gray-500 col-span-full">
                  {filter ? 'No products match your search' : 'No products found in this category'}
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product._id} className="bg-gray-300 rounded-lg text-center p-4 hover:bg-white hover:shadow-md transition-all">
                    <Image
                      src={product?.s3Key || "/product.jpg"}
                      alt={product.name}
                      width={200}
                      height={160}
                      className="w-full h-40 object-contain rounded-md"
                    />
                    <h4 className="text-lg font-bold mt-2">{product.name}</h4>
                    <p className="text-gray-500 text-sm mt-1">{product.description}</p>
                    <p className="text-yellow-500 text-sm mt-1">{product.ratings} ★ ({product.reviews} reviews)</p>
                    <p className="text-red-500 text-sm mt-1">{product.offer}</p>
                    <div className="mt-3 flex justify-center space-x-2">
                      <button 
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-900 transform hover:scale-105 transition-all"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart ${product.price}
                      </button>
                      <Link href={`/products/${product._id}`} passHref>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-900 transform hover:scale-105 transition-all">
                          More Info
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default HeaderAndProducts;