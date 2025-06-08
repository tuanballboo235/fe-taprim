import React from 'react';

const Button = ({ onClick, children }) => {
  return (
    <button onClick={onClick} style={{ padding: '8px 16px', cursor: 'pointer' }}>
      {children}
    </button>
  );
};

export default Button;