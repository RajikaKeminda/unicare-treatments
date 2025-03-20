'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import Link from 'next/link';
import axios from 'axios';

const HeaderAndProducts = () => {
  const [filter, setFilter] = useState('');           // State for the filter input
  const [products, setProducts] = useState([]);       // State to store fetched products
  const [loading, setLoading] = useState(true);       // Loading state
  const [error, setError] = useState(null);           // Error state
  const [cartCount, setCartCount] = useState(0);      // Cart item count

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/products`);  // Use axios for better handling
        console.log('API Response:', response);  // Log full response to inspect it
        
        // Check if the data is an array or nested within an object
        if (Array.isArray(response.data)) {
          setProducts(response.data);  // Set products to the fetched data
        } else if (response.data && response.data.products) {
          setProducts(response.data.products);  // If products are nested inside a 'products' key
        } else {
          throw new Error('Data is not in expected array format');
        }
      } catch (error) {
        setError('Failed to fetch products');
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);  // Set loading to false once fetch is complete (whether successful or not)
      }
    };

    fetchProducts();

    // Update cart count from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(savedCart.length);
  }, []);

  // Filter products based on search input
  const filteredProducts = filter 
    ? Array.isArray(products) ? products.filter((product) =>
        product.name.toLowerCase().includes(filter.toLowerCase())
      ) : [] // Ensure that products is an array before filtering
    : products;

  const addToCart = (product) => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if the product is already in the cart
    const productExists = savedCart.some(item => item._id === product._id);
    
    if (!productExists) {
      savedCart.push({ ...product, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(savedCart));
      setCartCount(savedCart.length); // Update cart count in header
    } else {
      alert('This product is already in your cart!'); // Optionally alert the user
    }
  };

  return (
    <div>
      {/* Header Section */}
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
                value={filter || ''}  // Ensure that 'filter' is always a string
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

            <Link href={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700 hidden sm:block'>
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Loading, Error, and Product Display */}
      <section className="relative p-4">
        {loading ? (
          <div className="text-center text-xl text-gray-700">Loading products...</div>
        ) : error ? (
          <div className="text-center text-xl text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center text-xl text-gray-500">No products found</div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id} className="bg-gray-300 rounded-lg text-center p-4 hover:bg-white hover:shadow-md transition-all">
                  <Image
                    src="/product.jpg"
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
                      onClick={() => addToCart(product)} // Add to cart
                    >
                      Add to Cart ${product.price}
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-900 transform hover:scale-105 transition-all">
                      More Info
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HeaderAndProducts;