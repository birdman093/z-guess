import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "./Header.css";
import Playlist from '../pages/Playlist.js';
import Home from '../pages/Home';
import Account from '../pages/Account.js';
import Properties from '../pages/Properties';


function Header() {
  return (
    <Router>
      <div className="main-body">
        <nav>
          <ul className="navBar">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/account">Account</Link></li>
            <li><Link to="/playlist">Playlist</Link></li>
            <li><Link to="/properties">Properties</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/account" element={<Account/>} />
          <Route path="/playlist" element={<Playlist/>} />
          <Route path="/properties" element={<Properties/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default Header;
