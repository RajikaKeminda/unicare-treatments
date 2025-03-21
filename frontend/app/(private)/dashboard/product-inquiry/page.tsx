'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the interface for advice requests
interface AdviceRequest {
  _id: string;
  name: string;
  email: string;
  concern: string;
  message: string;
  createdAt: string; // or Date if you parse it
}

const AdviceRequestsTable = () => {
  const [requests, setRequests] = useState<AdviceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch advice requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get<AdviceRequest[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/advice-requests`);
        setRequests(response.data);
      } catch (error) {
        setError('Failed to fetch advice requests');
        console.error('Error fetching advice requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <div className="text-center text-xl text-gray-700">Loading advice requests...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Submitted Advice Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concern</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">No advice requests found.</td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{request.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{request.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">{request.concern}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{request.message}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdviceRequestsTable;