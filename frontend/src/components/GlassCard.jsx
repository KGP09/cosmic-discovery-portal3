import React from "react";

const GlassCard = ({ children, className, hoverable = false }) => {
  return (
    <div
      className={`glass-panel rounded-xl p-6 ${hoverable ? "transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
