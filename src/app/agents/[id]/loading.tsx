import React from 'react';

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
      </div>
    </div>
  );
}
