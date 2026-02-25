import React from 'react';

const Skeleton = ({ width, height, borderRadius = 'var(--radius-md)', className = '', style = {} }) => {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius,
        background: 'linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%)',
        backgroundSize: '200% 100%',
        ...style
      }}
    />
  );
};

export default Skeleton;
