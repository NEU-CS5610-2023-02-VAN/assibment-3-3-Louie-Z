import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>© {currentYear} Louie & Fo CS5610</p>
    </footer>
  );
}

export default Footer;
