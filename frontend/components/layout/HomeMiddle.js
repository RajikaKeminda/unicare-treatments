import Image from 'next/image';

export default function HomeMenu() {
    return (
        <section className="relative">
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-8">
                {/* Product 1 */}
                <div className="bg-gray-300 rounded-lg text-center p-4 hover:bg-white hover:shadow-md hover:shadow-gray-900/20 transition-all">
                    <Image 
                        src="/product.jpg" 
                        alt="Headphones" 
                        width={200} 
                        height={160} 
                        className="w-full h-40 object-contain rounded-md" 
                    />
                    <h4 className="text-lg font-bold mt-2">Product 1</h4>
                    <p className="text-gray-500 text-sm mt-1">Amazing product 1</p>
                    <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-900 hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out">
                        Add to Cart $15
                    </button>
                </div>

                {/* Product 2 */}
                <div className="bg-gray-300 rounded-lg text-center p-4 hover:bg-white hover:shadow-md hover:shadow-gray-900/20 transition-all">
                    <Image 
                        src="/product.jpg" 
                        alt="Watch" 
                        width={200} 
                        height={160} 
                        className="w-full h-40 object-contain rounded-md" 
                    />
                    <h4 className="text-lg font-bold mt-2">Product 2</h4>
                    <p className="text-gray-500 text-sm mt-1">Amazing product 2</p>
                    <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-900 hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out">
                        Add to Cart $20
                    </button>
                </div>

                {/* Product 3 */}
                <div className="bg-gray-300 rounded-lg text-center p-4 hover:bg-white hover:shadow-md hover:shadow-gray-900/25 transition-all">
                    <Image 
                        src="/product.jpg" 
                        alt="Shoes" 
                        width={200} 
                        height={160} 
                        className="w-full h-40 object-contain rounded-md" 
                    />
                    <h4 className="text-lg font-bold mt-2">Product 3</h4>
                    <p className="text-gray-500 text-sm mt-1">Amazing product 3</p>
                    <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-900 hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out">
                        Add to Cart $25
                    </button>
                </div>

                {/* Product 4 */}
                <div className="bg-gray-300 rounded-lg text-center p-4 hover:bg-white hover:shadow-md hover:shadow-gray-900/25 transition-all">
                    <Image 
                        src="/product.jpg" 
                        alt="Bag" 
                        width={200} 
                        height={160} 
                        className="w-full h-40 object-contain rounded-md" 
                    />
                    <h4 className="text-lg font-bold mt-2">Product 4</h4>
                    <p className="text-gray-500 text-sm mt-1">Amazing product 4</p>
                    <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-900 hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out">
                        Add to Cart $30
                    </button>
                </div>
            </div>

            {/* Another row of products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-5">
                {/* Product 5 */}
                <div className="bg-gray-300 rounded-lg text-center p-4 hover:bg-white hover:shadow-md hover:shadow-gray-900/25 transition-all">
                    <Image 
                        src="/product.jpg" 
                        alt="Hat" 
                        width={200} 
                        height={160} 
                        className="w-full h-40 object-contain rounded-md" 
                    />
                    <h4 className="text-lg font-bold mt-2">Product 5</h4>
                    <p className="text-gray-500 text-sm mt-1">Amazing product 5</p>
                    <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-900 hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out">
                        Add to Cart $15
                    </button>
                </div>

                {/* Product 6 */}
                <div className="bg-gray-300 rounded-lg text-center p-4 hover:bg-white hover:shadow-md hover:shadow-gray-900/25 transition-all">
                    <Image 
                        src="/product.jpg" 
                        alt="Bottle" 
                        width={200} 
                        height={160} 
                        className="w-full h-40 object-contain rounded-md" 
                    />
                    <h4 className="text-lg font-bold mt-2">Product 6</h4>
                    <p className="text-gray-500 text-sm mt-1">Healthy product 6</p>
                    <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-900 hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out">
                        Add to Cart $20
                    </button>
                </div>

                {/* Product 7 */}
                <div className="bg-gray-300 rounded-lg text-center p-4 hover:bg-white hover:shadow-md hover:shadow-gray-900/25 transition-all">
                    <Image 
                        src="/product.jpg" 
                        alt="Clothes" 
                        width={200} 
                        height={160} 
                        className="w-full h-40 object-contain rounded-md" 
                    />
                    <h4 className="text-lg font-bold mt-2">Product 7</h4>
                    <p className="text-gray-500 text-sm mt-1">Beautiful product 7</p>
                    <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-900 hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out">
                        Add to Cart $25
                    </button>
                </div>

                {/* Product 8 */}
                <div className="bg-gray-300 rounded-lg text-center p-4 hover:bg-white hover:shadow-md hover:shadow-gray-900/25 transition-all">
                    <Image 
                        src="/product.jpg" 
                        alt="Mouse" 
                        width={200} 
                        height={160} 
                        className="w-full h-40 object-contain rounded-md" 
                    />
                    <h4 className="text-lg font-bold mt-2">Product 8</h4>
                    <p className="text-gray-500 text-sm mt-1">Useful product 8</p>
                    <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-900 hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out">
                        Add to Cart $30
                    </button>
                </div>
            </div>
        </section>
    );
}
