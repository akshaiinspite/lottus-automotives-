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
        <Link to="/" className="header__logo" aria-label="GT Autohaus – Home">
          <img
            src="/WhatsApp Image 2026-07-11 at 12.31.57.jpeg"
            alt="GT Autohaus logo – Premium Car Service Kochi"
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
          <li className="header__mobile-cta">
            <a
              href="https://wa.me/919061099906?text=Hello%20GT%20Autohaus,%20I'd%20like%20to%20book%20an%20appointment%20for%20my%20car."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
              Book Appointment
            </a>
          </li>
        </ul>

        <a
          href="https://wa.me/919061099906?text=Hello%20GT%20Autohaus,%20I'd%20like%20to%20book%20an%20appointment%20for%20my%20car."
          target="_blank"
          rel="noopener noreferrer"
          className="header__btn-appointment btn-primary"
          id="header-whatsapp-btn"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
          </svg>
          Book Appointment
        </a>

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
