import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Contact Us', path: '/contact' },
  ]

  return (
    <header
      className={`header ${scrolled ? 'header--scrolled' : ''} ${menuOpen ? 'header--menu-open' : ''}`}
      role="banner"
      id="site-header"
    >
      <nav className="header__nav container-wide" aria-label="Main navigation">
        <Link to="/" className="header__logo" aria-label="Lottus Automotives – Home">
          <img
            src="/WhatsApp Image 2026-07-11 at 12.31.57.jpeg"
            alt="Lottus Automotives logo – Premium Car Service Kochi"
            className="header__logo-img"
            width="160"
            height="48"
          />
        </Link>

        <ul className={`header__links ${menuOpen ? 'header__links--open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`header__link ${location.pathname === item.path ? 'header__link--active' : ''}`}
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          id="mobile-menu-toggle"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="header__overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}
    </header>
  )
}

export default Header
