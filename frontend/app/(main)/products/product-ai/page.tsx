import React from 'react';

const ComingSoonPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white text-gray-900">
      <div className="text-center p-6 md:p-12 bg-gray-100 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-semibold text-red-500 mb-6">AI Product Assistant</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Coming Soon</h2>
        <p className="text-lg text-gray-600 mb-6">
            We&apos;re working hard to bring you an AI-powered product assistant that will revolutionize your experience.
        </p>
        
        <div className="mb-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 border-4 border-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="text-gray-500 mb-4">
          <p>Stay tuned for the upcoming launch!</p>
          <p>Enter your email to get notified:</p>
        </div>

        <div>
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 rounded-md border border-gray-300 mb-4 text-gray-700 focus:outline-none focus:border-red-500"
          />
          <button
            className="w-full p-3 rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-300"
          >
            Notify Me
          </button>
        </div>
        
        <footer className="mt-8 text-sm text-gray-500">
          <p>© 2025 AI Product Assistant. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default ComingSoonPage;