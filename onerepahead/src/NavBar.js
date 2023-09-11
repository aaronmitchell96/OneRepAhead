import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'
import './stylesheets/NavBar.css';
import logo from './images/One-Rep-Ahead-logo-two.png'
import { useSignOut, useIsAuthenticated, useAuthUser } from 'react-auth-kit';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const auth = useAuthUser()

  const handleLogout = () => {
      signOut();
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          {/* Replace the following line with your logo */}
          <img src={logo} alt="logo" />
        </div>
        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="navbar-list">
            <NavLink to="/">
              <li className="navbar-item">
                Home
              </li>
            </NavLink>
            <li className="navbar-item">
              <a href="#about">About</a>
            </li>
            <li className="navbar-item">
              <a href="#services">Services</a>
            </li>
            {
             isAuthenticated() ?
             (
              <>
                <li onClick={handleLogout} className="navbar-item">
                  <a>Sign Out</a>
                </li>
                <NavLink to='/profile'>
                  <li className='navbar-item'>
                      {auth().username}
                  </li>
                </NavLink>
              </>
             ) : (
              <>
               <NavLink to="/register">
                <li className="navbar-item">
                  Sign Up
                </li>
               </NavLink>
               <NavLink to="/login">
                <li className="navbar-item">
                  Login
                </li>
               </NavLink>
              </>
             )
            }
          </ul>
        </div>
        <div className="navbar-toggle" onClick={handleMenuToggle}>
          <div className={`navbar-toggle-line ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`navbar-toggle-line ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`navbar-toggle-line ${isMenuOpen ? 'open' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;