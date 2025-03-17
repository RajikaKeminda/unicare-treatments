'use client';

import Image from 'next/image';
import { useState } from 'react';
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import Link from 'next/link';

const products = [
    { id: 1, name: 'Product 1', desc: 'Amazing product 1', price: 15, rating: 4.5, reviews: 12, offer: '10% off' },
    { id: 2, name: 'Product 2', desc: 'Amazing product 2', price: 20, rating: 4.0, reviews: 8, offer: '15% off' },
    { id: 3, name: 'Product 3', desc: 'Amazing product 3', price: 25, rating: 4.7, reviews: 20, offer: '20% off' },
    { id: 4, name: 'Product 4', desc: 'Amazing product 4', price: 30, rating: 4.2, reviews: 10, offer: 'Free Shipping' },
    { id: 5, name: 'Product 5', desc: 'Amazing product 5', price: 15, rating: 4.1, reviews: 7, offer: 'Buy 1 Get 1' },
    { id: 6, name: 'Product 6', desc: 'Healthy product 6', price: 20, rating: 4.3, reviews: 9, offer: '5% off' },
    { id: 7, name: 'Product 7', desc: 'Beautiful product 7', price: 25, rating: 4.6, reviews: 15, offer: 'Limited Offer' },
    { id: 8, name: 'Product 8', desc: 'Useful product 8', price: 30, rating: 4.0, reviews: 5, offer: 'Flash Sale' },
];

const HeaderAndProducts = () => {
    const [filter, setFilter] = useState('');

    // Filter products based on search input
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(filter.toLowerCase())
    );

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
                            value={filter}  // Bind the input value to filter state
                            onChange={(e) => setFilter(e.target.value)}  // Update filter state on input change
                            className="w-full h-10 outline-none rounded-l-full pl-3 text-black"
                        />
                        <div className="text-lg min-w-[50px] h-10 bg-red-600 flex items-center justify-center rounded-r-full text-white">
                            <GrSearch />
                        </div>
                    </div>

                    {/* User and Cart Icons */}
                    <div className="flex items-center gap-5 md:gap-7 mt-3 md:mt-0">
                        <div className="text-3xl cursor-pointer">
                            <FaRegCircleUser/>
                        </div>

                        <Link href="/Shopping-cart">
                            <div className="text-2xl relative">
                                <span><FaShoppingCart /></span>
                                <div className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center absolute -top-2 -right-3 text-xs">
                                    0 
                                </div>
                            </div>
                        </Link>

                        <Link href={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700 hidden sm:block'>
                            Login
                        </Link>
                    </div>

                </div>
            </header>

            {/* Categories Row Below Search Bar */}
            <div className="mb-6">
                <div className="flex justify-center space-x-10 mt-6 bg-gray-700 p-2 rounded-full shadow-lg">
                    <Link 
                        href="/" 
                        className="text-lg text-white font-medium transition-colors duration-300 ease-in-out transform hover:text-red-500 hover:scale-105"
                    >
                        Category 1
                    </Link>
                    <Link 
                        href="/" 
                        className="text-lg text-white font-medium transition-colors duration-300 ease-in-out transform hover:text-red-500 hover:scale-105"
                    >
                        Category 2
                    </Link>
                    <Link 
                        href="/" 
                        className="text-lg text-white font-medium transition-colors duration-300 ease-in-out transform hover:text-red-500 hover:scale-105"
                    >
                        Category 3
                    </Link>
                    <Link 
                        href="/" 
                        className="text-lg text-white font-medium transition-colors duration-300 ease-in-out transform hover:text-red-500 hover:scale-105"
                    >
                        Category 4
                    </Link>
                    <Link 
                        href="/" 
                        className="text-lg text-white font-medium transition-colors duration-300 ease-in-out transform hover:text-red-500 hover:scale-105"
                    >
                        Category 5
                    </Link>
                </div>
            </div>


            {/* Product Grid */}
            <section className="relative p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-gray-300 rounded-lg text-center p-4 hover:bg-white hover:shadow-md transition-all">
                            <Image
                                src="/product.jpg"
                                alt={product.name}
                                width={200}
                                height={160}
                                className="w-full h-40 object-contain rounded-md"
                            />
                            <h4 className="text-lg font-bold mt-2">{product.name}</h4>
                            <p className="text-gray-500 text-sm mt-1">{product.desc}</p>
                            {/* Reviews & Ratings */}
                            <p className="text-yellow-500 text-sm mt-1">{product.rating} ★ ({product.reviews} reviews)</p>
                            {/* Offers/Discounts */}
                            <p className="text-red-500 text-sm mt-1">{product.offer}</p>
                            {/* Buttons */}
                            <div className="mt-3 flex justify-center space-x-2">
                                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-900 transform hover:scale-105 transition-all">
                                    Add to Cart ${product.price}
                                </button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-900 transform hover:scale-105 transition-all">
                                    More Info
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HeaderAndProducts;
