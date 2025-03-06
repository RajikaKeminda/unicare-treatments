'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

// Define the shape of the error response data
interface ErrorResponse {
  message: string;
}

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
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
    <div className="signup-container">
      <div className="signup-form">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button onClick={handleSignup}>Sign Up</button>
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
      
      <style jsx>{`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f7f7f7;
        }
        .signup-form {
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }
        h2 {
          font-size: 2rem;
          margin-bottom: 20px;
          text-align: center;
        }
        input {
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: 1rem;
        }
        button {
          width: 100%;
          padding: 12px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #0056b3;
        }
        .error-message {
          color: red;
          margin-bottom: 10px;
          font-size: 1rem;
        }
        .login-link {
          text-align: center;
          margin-top: 20px;
        }
        .login-link a {
          color: #007bff;
          text-decoration: none;
        }
        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Signup;
