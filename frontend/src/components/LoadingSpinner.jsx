import React from "react";

const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`rounded-full border-t-transparent border-primary animate-spin ${sizeClasses[size]} ${className}`}
      />
    </div>
  );
};

export default LoadingSpinner;
