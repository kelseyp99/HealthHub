import React from 'react';
import './NotFound.scss';

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <h2>404 - Page Not Found</h2>
      <p>Sorry, we couldn’t find what you were looking for.</p>
    </div>
  );
};

export default NotFound;
