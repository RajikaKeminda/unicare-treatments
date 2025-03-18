export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 sm:px-8">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h4 className="text-lg font-bold mb-4">About Us</h4>
          <p className="text-sm text-gray-400">
            Welcome to our Unicare treatment center! Discover a variety of
            Ayurvedic products and more at amazing prices. All designed to
            support your health and well-being.
          </p>
        </div>

        {/* Navigation Section */}
        <div>
          <h4 className="text-lg font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="#home" className="hover:text-red-500 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#menu" className="hover:text-red-500 transition">
                Appointment
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-red-500 transition">
                Treatment Updates
              </a>
            </li>
            <li>
              <a href="#menu" className="hover:text-red-500 transition">
                Instruction blogs
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="text-lg font-bold mb-4">Contact Us</h4>
          <p className="text-sm text-gray-400">
            123 Gall road, colombo 3, Sri Lanka
          </p>
          <p className="text-sm text-gray-400">
            Email: support@Unicarestore.com
          </p>
          <p className="text-sm text-gray-400">Phone: +94 77 123 4567</p>
        </div>
      </div>

      {/* Social Media and Copyright */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-center">
        <div className="flex justify-center space-x-4 mb-4">
          <a href="#" className="text-gray-400 hover:text-white transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.56v14.91c0 .98-.8 1.78-1.78 1.78H1.78C.8 21.25 0 20.45 0 19.47V4.56c0-.98.8-1.78 1.78-1.78h20.44c.98 0 1.78.8 1.78 1.78zM9.6 17.28h2.94V9.94H9.6v7.34zM10.89 8.74c.91 0 1.64-.74 1.64-1.64 0-.9-.74-1.64-1.64-1.64s-1.64.74-1.64 1.64c0 .9.74 1.64 1.64 1.64zm7.71 8.54h2.94v-4.28c0-2.13-2.13-2.29-2.13 0v4.28zm.37-7.48c.93 0 1.68-.75 1.68-1.68s-.75-1.68-1.68-1.68-1.68.75-1.68 1.68.75 1.68 1.68 1.68zM22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22.23 0H1.77C.79 0 0 .8 0 1.77v20.46C0 23.2.8 24 1.77 24h11.1v-9.28H9.66v-3.6h3.2V8.75c0-3.19 1.94-4.93 4.78-4.93 1.36 0 2.54.1 2.88.15v3.33h-1.98c-1.55 0-1.85.73-1.85 1.8v2.35h3.7l-.48 3.6h-3.22V24h6.32c.97 0 1.77-.8 1.77-1.77V1.77C24 .79 23.2 0 22.23 0z" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.608 1.794-1.57 2.165-2.723-.951.564-2.005.974-3.127 1.195-.897-.959-2.178-1.555-3.594-1.555-2.725 0-4.932 2.208-4.932 4.932 0 .387.043.764.127 1.124C7.69 8.094 4.066 6.13 1.64 3.161c-.423.724-.666 1.562-.666 2.475 0 1.708.869 3.216 2.188 4.1-.807-.026-1.566-.247-2.228-.616v.062c0 2.388 1.698 4.382 3.946 4.835-.413.111-.849.171-1.296.171-.318 0-.626-.031-.928-.088.626 1.956 2.444 3.381 4.604 3.419-1.684 1.318-3.809 2.104-6.102 2.104-.397 0-.789-.023-1.175-.069 2.179 1.399 4.768 2.214 7.548 2.214 9.057 0 14.009-7.507 14.009-14.01 0-.213-.005-.426-.014-.637.961-.693 1.797-1.56 2.457-2.548l-.047-.02z" />
            </svg>
          </a>
        </div>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Unicare treetment Center. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
