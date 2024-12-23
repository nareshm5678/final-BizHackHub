import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BIS Learning Platform
              </span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-300"
              >
                Dashboard
              </Link>
            </div>

            {/* "Return to Home" Button */}
            <Link to="http://localhost:5173/" className="ml-4">
              <button className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:from-yellow-500 hover:to-pink-500 transition-transform transform hover:scale-105 duration-300">
                Return to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
