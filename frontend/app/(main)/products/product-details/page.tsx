import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ProductStoryPage = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Header Section */}
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-red-600">Discover the Essence of Ayurveda</h1>
        <p className="mt-4 text-lg">Experience natural healing with our premium Ayurvedic products, crafted with care and tradition.</p>
      </header>

      {/* Product Details Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Section: Product Image */}
          <div className="flex justify-center">
            <Image
              src="/product-details.png" // Replace with your image source
              alt="Ayurveda Product"
              className="w-full max-w-md rounded-lg shadow-lg"
              width={100}
              height={100}
              unoptimized 
            />
          </div>

          {/* Right Section: Product Information */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">Our Featured Product</h2>
            <p className="text-lg text-gray-600">
              Our Ayurveda products are made using time-honored methods, combining ancient knowledge with modern techniques. Each ingredient is carefully selected to ensure optimal quality and efficacy. From skincare to wellness, our products provide holistic benefits.
            </p>

            <h3 className="text-2xl font-semibold">Product Features:</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>100% Natural Ingredients</li>
              <li>Handcrafted with Traditional Ayurvedic Recipes</li>
              <li>Free from Harmful Chemicals and Preservatives</li>
              <li>Suitable for All Skin Types</li>
              <li>Eco-Friendly and Sustainable Packaging</li>
            </ul>

            <h3 className="text-2xl font-semibold">Key Benefits:</h3>
            <p className="text-gray-600">
              Our products promote balance, healing, and rejuvenation from the inside out. With consistent use, you&apos;ll experience:
            </p>
            <ul className="list-disc list-inside text-gray-700">
              <li>Glowing and Healthy Skin</li>
              <li>Enhanced Vitality and Energy</li>
              <li>Improved Digestion and Metabolism</li>
              <li>Stress Relief and Better Sleep</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Product Story Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold mb-6">The Story Behind the Product</h2>
          <p className="text-lg text-gray-700">
            Our Ayurveda products are rooted in the wisdom of over 5,000 years of ancient healing traditions. The formulations are designed to balance the mind, body, and spirit through the use of potent natural ingredients. From the tranquil Himalayan mountains to the lush Indian forests, we source the best herbs, roots, and flowers to create remedies that have been passed down through generations.
          </p>
          <div className="mt-8">
            <Image
              src="/product-details-2.png" // Replace with your image source
              alt="Ayurvedic Process"
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
              width={100}
              height={50}
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6">What Our Customers Say</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p className="text-lg text-gray-600">
              &quot;I&apos;ve been using the Ayurveda skincare products for a few weeks now, and my skin has never looked better. The natural ingredients really make a difference!&quot;
              </p>
              <p className="mt-4 font-semibold text-red-600">- Priya M.</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p className="text-lg text-gray-600">
              &quot;These wellness supplements have helped me feel more energized and at peace. I love how natural and safe they feel.&quot;
              </p>
              <p className="mt-4 font-semibold text-red-600">- Arjun R.</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p className="text-lg text-gray-600">
              &quot;I&apos;ve struggled with stress for years, but since I started using these products, my anxiety has decreased significantly. Truly life-changing!&quot;
              </p>
              <p className="mt-4 font-semibold text-red-600">- Seema S.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-red-600 text-white py-10 text-center">
        <h2 className="text-3xl font-semibold mb-4">Embrace the Healing Power of Ayurveda</h2>
        <p className="text-lg mb-6">Start your journey to holistic health and well-being today. Explore our product range and experience the natural goodness.</p>
        <Link href="/products/product-view">
        <button className="bg-white text-red-600 px-6 py-3 text-xl rounded-lg hover:bg-gray-100 transition duration-300">Shop Now</button>
        </Link>
      </section>
    </div>
  );
};

export default ProductStoryPage;