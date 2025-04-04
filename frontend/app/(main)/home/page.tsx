"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import {
  FaLeaf,
  FaSpa,
  FaHeartbeat,
  FaUserMd,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const services = [
  {
    icon: <FaLeaf className="w-12 h-12" />,
    title: "Ayurvedic Treatments",
    description: "Traditional healing methods for holistic wellness",
  },
  {
    icon: <FaSpa className="w-12 h-12" />,
    title: "Massage Therapy",
    description: "Therapeutic massages for relaxation and healing",
  },
  {
    icon: <FaHeartbeat className="w-12 h-12" />,
    title: "Wellness Programs",
    description: "Customized wellness plans for your health goals",
  },
  {
    icon: <FaUserMd className="w-12 h-12" />,
    title: "Consultations",
    description: "Expert Ayurvedic consultations and guidance",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    text: "The treatments here have transformed my life. I feel more balanced and energized than ever.",
    role: "Client",
  },
  {
    name: "Michael Chen",
    text: "Professional staff and excellent service. The Ayurvedic treatments are truly effective.",
    role: "Client",
  },
  {
    name: "Emma Davis",
    text: "A peaceful sanctuary for healing. I highly recommend their wellness programs.",
    role: "Client",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative h-screen">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          className="h-full"
        >
          <SwiperSlide className="relative">
            <div className="absolute inset-0 bg-black/50 z-10" />
            <Image
              src="/images/ayurveda-hero-1.jpg"
              alt="Ayurvedic Treatment"
              fill
              className="object-cover"
              priority
            />
          </SwiperSlide>
          <SwiperSlide className="relative">
            <div className="absolute inset-0 bg-black/50 z-10" />
            <Image
              src="/images/ayurveda-hero-2.jpg"
              alt="Wellness Center"
              fill
              className="object-cover"
            />
          </SwiperSlide>
          <SwiperSlide className="relative">
            <div className="absolute inset-0 bg-black/50 z-10" />
            <Image
              src="/images/ayurveda-hero-3.jpg"
              alt="Massage Therapy"
              fill
              className="object-cover"
            />
          </SwiperSlide>
        </Swiper>
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white px-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Welcome to Unicare Ayurveda
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover the ancient wisdom of Ayurvedic healing
            </p>
            <Link
              href="/channeling"
              className="bg-white text-green-800 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors"
            >
              Book Appointment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              About Our Ayurvedic Center
            </h2>
            <p className="text-gray-600 text-lg">
              At Unicare Ayurveda, we combine ancient wisdom with modern
              understanding to provide holistic healing solutions. Our
              experienced practitioners are dedicated to helping you achieve
              optimal health and wellness through personalized Ayurvedic
              treatments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-green-600 mb-4 flex justify-center">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-lg"
              >
                <p className="text-gray-600 mb-4">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Begin Your Wellness Journey?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Contact us today to schedule a consultation and discover how
              Ayurvedic healing can transform your life.
            </p>
            <Link
              href="/contact-us"
              className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Unicare Ayurveda
              </h3>
              <p className="text-gray-400 mb-4">
                Your journey to holistic wellness begins here. Experience the
                ancient wisdom of Ayurveda.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTwitter className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/treatments"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Treatments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/channeling"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Book Appointment
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <FaPhone className="text-green-500" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FaEnvelope className="text-green-500" />
                  <span>info@unicareayurveda.com</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-green-500" />
                  <span>123 Wellness Street, City, Country</span>
                </li>
              </ul>
            </div>

            {/* Opening Hours */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Opening Hours
              </h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 7:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Unicare Ayurveda. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
