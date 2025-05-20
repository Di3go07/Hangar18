import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../style/header.css'

export default function Header() {

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <div className='banner'>
        <h1 className='titulo'> HANGAR 18</h1>
      </div>
    
      <button className="hamburger-btn" onClick={toggleMenu}>
        <span className="hamburger-icon">
          {isOpen ? '✕' : '☰'}  
        </span>
      </button>
    
      <nav className={`navbar ${isOpen ? 'open' : ''}`}>
        <Link to="/home" onClick={() => setIsOpen(false)}>HOME</Link>
        <Link to="/noticia" onClick={() => setIsOpen(false)}>NOTÍCIAS</Link>
        <Link to="/" onClick={() => setIsOpen(false)}>MATÉRIAS</Link>
        <Link to="/" onClick={() => setIsOpen(false)}>RESENHAS</Link>
        <Link to="/" onClick={() => setIsOpen(false)}>LANÇAMENTOS</Link>
      </nav>
    </header>
  );
}