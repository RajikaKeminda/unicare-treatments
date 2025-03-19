import React from 'react';

const ExpertAyurvedicAdvicePage = () => {
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
            Fill out the form below to receive personalized Ayurvedic advice from our expert practitioners. Whether you're seeking solutions for skin care, digestion, stress, or overall wellness, our team is here to help!
          </p>

          {/* Form Section */}
          <form className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-lg text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-lg text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Your Email"
                />
              </div>

              <div>
                <label className="block text-lg text-gray-700">Select Concern</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Tell us about your health concern"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-8 py-3 text-xl rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Doctor's Message Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-semibold">A Message from Our Ayurvedic Doctor</h2>
          <div className="text-lg text-gray-600">
            <p>
              "At our Ayurveda clinic, we believe that true wellness comes from harmony between your body, mind, and spirit. Our approach is not a one-size-fits-all solution, but a personalized plan designed specifically for your needs. Ayurveda takes into account your unique constitution (Prakriti) and helps to restore balance through natural remedies, diet, and lifestyle adjustments. We are here to guide you every step of the way in your wellness journey."
            </p>
            <p className="mt-6 text-xl font-semibold text-red-600">- Dr. Asha Patil, Ayurvedic Practitioner</p>
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
    src="https://www.google.com/maps/place/Unicare+Holistic+Treatment+Center+-+Dharga+Town/@6.4387838,80.0369078,17z/data=!3m1!4b1!4m6!3m5!1s0x3ae22d951dafa2cb:0xff01918bb691cbbb!8m2!3d6.4387838!4d80.0394827!16s%2Fg%2F11l22c71pl?entry=ttu&g_ep=EgoyMDI1MDMxNi4wIKXMDSoASAFQAw%3D%3D"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen={true} 
    loading="lazy"
  ></iframe>
</div>
      </section>
    </div>
  );
};

export default ExpertAyurvedicAdvicePage;
