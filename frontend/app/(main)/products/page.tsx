import product from "@/public/ayurveda-product.png";
import uniform from "@/public/product-intro.png";
import story from "@/public/product-history.png";
import product_ai from "@/public/product-ai.png";
import advice from "@/public/advice-product.png";
import Image from "next/image";
import Link from "next/link";  // Import Link component from next/link

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white border-t-2">
      <div className="container mx-auto px-4 pt-4 pb-16">
        {/* Hero Image */}
        <div className="relative flex align-center justify-center mb-4">
          <Image src={uniform} width="150" height="225" alt="uniform" />
          <div className="absolute left-0 bottom-0 w-full h-[50px] bg-gradient-to-t from-white to-transparent"></div>
        </div>

        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
            Welcome To Product Page
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Explore our wide range of products, from healthcare essentials to advanced tools — all in one place.
          </p>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product Card 1 */}
          <Link href="/products/product-view"> 
            <div className="rounded-lg border border-gray-300 shadow-md p-3 transition-all transform hover:scale-105 hover:shadow-xl hover:bg-gray-50 cursor-pointer">
              <div className="relative h-32">
                <Image src={product} alt="doctor" layout="fill" objectFit="cover" className="rounded-t-lg" />
              </div>
              <h3 className="text-lg font-semibold mt-2"> 📦 Explore Products</h3>
              <p className="text-sm text-gray-600 mt-2">
                Discover a range of authentic Ayurvedic remedies.
              </p>
              <p className="text-blue-600 mt-3 block text-center text-sm">
                Learn More
              </p>
            </div>
          </Link>

          {/* Product Card 2 */}
          <Link href="/products/product-ai">
            <div className="rounded-lg border border-gray-300 shadow-md p-3 transition-all transform hover:scale-105 hover:shadow-xl hover:bg-gray-50 cursor-pointer">
              <div className="relative h-32">
                <Image src={product_ai} alt="lab" layout="fill" objectFit="cover" className="rounded-t-lg" />
              </div>
              <h3 className="text-lg font-semibold mt-2">🤖 AI Product Adviser</h3>
              <p className="text-sm text-gray-600 mt-2">
                Get personalized product suggestions with AI guidance.
              </p>
              <p className="text-blue-600 mt-3 block text-center text-sm">
                Learn More
              </p>
            </div>
          </Link>

          {/* Product Card 3 */}
          <Link href="/products/product-details">
            <div className="rounded-lg border border-gray-300 shadow-md p-3 transition-all transform hover:scale-105 hover:shadow-xl hover:bg-gray-50 cursor-pointer">
              <div className="relative h-32">
                <Image src={story} alt="appointments" layout="fill" objectFit="cover" className="rounded-t-lg" />
              </div>
              <h3 className="text-lg font-semibold mt-2"> 📖 Product Story</h3>
              <p className="text-sm text-gray-600 mt-2">
                Uncover detailed descriptions and ancient benefits of each product.
              </p>
              <p className="text-blue-600 mt-3 block text-center text-sm">
                Learn More
              </p>
            </div>
          </Link>

          {/* Product Card 4 */}
          <Link href="/products/product-inquiry">
            <div className="rounded-lg border border-gray-300 shadow-md p-3 transition-all transform hover:scale-105 hover:shadow-xl hover:bg-gray-50 cursor-pointer">
              <div className="relative h-32">
                <Image src={advice} alt="location" layout="fill" objectFit="cover" className="rounded-t-lg" />
              </div>
              <h3 className="text-lg font-semibold mt-2">🌼Expert Ayurvedic Advice</h3>
              <p className="text-sm text-gray-600 mt-2">
                Get expert advice and find personalized wellness products
              </p>
              <p className="text-blue-600 mt-3 block text-center text-sm">
                Learn More
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}