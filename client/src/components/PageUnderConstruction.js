import React from 'react';
import Header from './Header';

function PageUnderConstruction() {
  return (

    <>

    <Header/>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="text-6xl mb-4 text-yellow-500 animate-bounce">
          🚧
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Page Under Construction
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          We're working hard to bring this page to you. Please check back soon!
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Go Back to Home
        </a>
      </div>
    </div>
    </>
 
  );
}

export default PageUnderConstruction;
