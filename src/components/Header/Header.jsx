import React from 'react'
import "./Header.css";
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className='header-container'>
      <div className='header'>Personal Finance Tracker</div>
      <nav>
        <ul>
          <li>
            <Link to='/login'>Login</Link>
          </li>
          <li>
            <Link to='/signup'>SignUp</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
