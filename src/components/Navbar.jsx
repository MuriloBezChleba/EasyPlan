import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

// Importando as imagens SVG
import CalendarIcon from '../images/Calendar.svg';
import GraficoIcon from '../images/Graficos.svg';
import ContatIcon from '../images/Conta.svg'
import TimerIcon from '../images/Timer.svg';

const Navbar = () => {
  return (
    <nav className="bottom-navbar">
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/conta"
            className={({ isActive }) => (isActive ? 'active-link' : 'link')}
          >
            <img src={ContatIcon} alt="Home" className="icon" />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/timer"
            className={({ isActive }) => (isActive ? 'active-link' : 'link')}
          >
            <img src={TimerIcon} alt="Timer" className="icon" />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/grafico"
            className={({ isActive }) => (isActive ? 'active-link' : 'link')}
          >
            <img src={GraficoIcon} alt="Timer" className="icon" />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/calendar"
            className={({ isActive }) => (isActive ? 'active-link' : 'link')}
          >
            <img src={CalendarIcon} alt="Calendar" className="icon" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;