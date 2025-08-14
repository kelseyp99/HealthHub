import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Dietitians</Link></li>
        <li><Link to="/profile/1">Profile</Link></li>
        <li><Link to="/discussions">Discussions</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/test">Test</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
