"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Head from "next/head";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // This would typically connect to an API route
      // For demonstration, we're just simulating a submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate a successful submission
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setError("There was an error submitting your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Contact Us | Your Company</title>
        <meta name="description" content="Get in touch with our team" />
      </Head>

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            We&apos;d love to hear from you. Fill out the form below and
            we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Contact Information */}
            <div className="bg-black p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Address</h3>
                  <p className="mt-1">123 Business Street</p>
                  <p>Suite 100</p>
                  <p>San Francisco, CA 94103</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Email</h3>
                  <p className="mt-1">contact@yourcompany.com</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Phone</h3>
                  <p className="mt-1">(555) 123-4567</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Hours</h3>
                  <p className="mt-1">Monday - Friday: 9AM - 5PM PST</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 bg-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h2 className="mt-4 text-2xl font-medium text-gray-900">
                    Thank you!
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Your message has been received. We&apos;ll get back to you
                    soon.
                  </p>
                  <button
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-black"
                    onClick={() => setSubmitted(false)}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {error && <div className="text-red-600 text-sm">{error}</div>}

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
