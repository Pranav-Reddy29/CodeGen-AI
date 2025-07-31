import React from 'react';

const ImageOptimizer = ({ src, alt, className = '', ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`max-w-full h-auto ${className}`}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default ImageOptimizer; 