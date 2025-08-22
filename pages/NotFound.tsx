
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-primary-600">404</h1>
        <p className="text-2xl md:text-3xl font-light text-gray-800 mt-4">
          Sorry, we couldn't find this page.
        </p>
        <p className="mt-4 text-gray-500">
          But dont worry, you can find plenty of other things on our homepage.
        </p>
        <Link
          to="/dashboard"
          className="inline-block mt-6 px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
