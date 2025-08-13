// components/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = ({ text = "Đang tải...", size = "md" }) => {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 text-gray-600">
      <svg
        className={`animate-spin ${sizeClass[size]} text-blue-600 mb-2`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p className="text-sm">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
