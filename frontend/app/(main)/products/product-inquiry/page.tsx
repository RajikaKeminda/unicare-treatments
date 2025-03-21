'use client';

import React, { useState } from 'react';
import axios from 'axios';

const ExpertAyurvedicAdvicePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    concern: 'skin',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/submit-advice-request`, formData);
      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          concern: 'skin',
          message: '',
        });
      }
    } catch (error) {
      setError('Failed to submit the form. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Header Section */}
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-red-600">Expert Ayurvedic Advice</h1>
        <p className="mt-4 text-lg">Get personalized Ayurvedic advice to enhance your health and well-being, tailored to your needs.</p>
      </header>

      {/* Introduction Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-semibold">What is Ayurveda?</h2>
          <p className="text-lg text-gray-600">
            Ayurveda is an ancient system of natural healing that originated in India over 5,000 years ago. It focuses on maintaining balance between the mind, body, and spirit to promote overall health and wellness. By understanding your unique body constitution (Prakriti), Ayurveda provides personalized recommendations for diet, lifestyle, and herbal remedies.
          </p>
        </div>
      </section>

      {/* Expert Advice Form Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold mb-6">Get Personalized Advice</h2>
          <p className="text-lg text-gray-700 mb-8">
            Fill out the form below to receive personalized Ayurvedic advice from our expert practitioners. Whether you&apos;re seeking solutions for skin care, digestion, stress, or overall wellness, our team is here to help!
          </p>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-lg text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <label className="block text-lg text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Your Email"
                  required
                />
              </div>

              <div>
                <label className="block text-lg text-gray-700">Select Concern</label>
                <select
                  name="concern"
                  value={formData.concern}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                >
                  <option value="skin">Skin Care</option>
                  <option value="digestion">Digestion</option>
                  <option value="stress">Stress Relief</option>
                  <option value="wellness">General Wellness</option>
                </select>
              </div>

              <div>
                <label className="block text-lg text-gray-700">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Tell us about your health concern"
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 text-white px-8 py-3 text-xl rounded-lg hover:bg-red-700 transition duration-300 disabled:bg-gray-400"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </form>

          {/* Success and Error Messages */}
          {success && (
            <div className="mt-4 text-green-600">
              Your request has been submitted successfully!
            </div>
          )}
          {error && (
            <div className="mt-4 text-red-600">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Doctor's Message Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-semibold">A Message from Our Ayurvedic Doctor</h2>
          <div className="text-lg text-gray-600">
            <p>
            &quot;At our Ayurveda clinic, we believe that true wellness comes from harmony between your body, mind, and spirit. Our approach is not a one-size-fits-all solution, but a personalized plan designed specifically for your needs. Ayurveda takes into account your unique constitution (Prakriti) and helps to restore balance through natural remedies, diet, and lifestyle adjustments. We are here to guide you every step of the way in your wellness journey.&quot;
            </p>
            <p className="mt-6 text-xl font-semibold text-red-600">- Dr. Dilshan</p>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl font-semibold mb-6">Visit Us Physically</h2>
        <p className="text-lg text-gray-600 mb-8">
          You can visit us at our physical location to get personalized Ayurvedic products and advice. We look forward to welcoming you!
        </p>

       {/* Google Maps Embed */}
       <div className="w-full h-96">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.6514944721343!2d80.03690777480512!3d6.438783793552445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae22d951dafa2cb%3A0xff01918bb691cbbb!2sUnicare%20Holistic%20Treatment%20Center%20-%20Dharga%20Town!5e0!3m2!1sen!2slk!4v1742447175303!5m2!1sen!2slk"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>

      </section>
    </div>
  );
};

export default ExpertAyurvedicAdvicePage;