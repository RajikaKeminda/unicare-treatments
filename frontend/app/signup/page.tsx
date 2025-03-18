'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

// Define the shape of the error response data
interface ErrorResponse {
  message: string;
}

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:8081/api/users', {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        // Show success message and redirect
        alert('Signup successful! You can now login.');
        router.push('/login');
      }
    } catch (err) {
      // Cast the error to AxiosError
      const error = err as AxiosError;

      // Default error message in case the error message is not found
      let errorMessage: string = 'Something went wrong!';

      // Check if the error response exists and has a 'message' property
      if (
        error.response?.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
      ) {
        // Cast to the expected ErrorResponse type
        const errorData = error.response.data as ErrorResponse;
        errorMessage = errorData.message; // Use the message from the server
      }

      // Set the error message (ensuring it's a string)
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <input 
          type="text" 
          placeholder="Name" 
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
          onClick={handleSignup} 
          className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
