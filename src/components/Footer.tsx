import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo" id="site-footer">
      <div className="footer__top-line" aria-hidden="true"></div>

      <div className="footer__content container-wide">
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <Link to="/" aria-label="GT Autohaus Home">
              <img
                src="/WhatsApp Image 2026-07-11 at 12.31.57.jpeg"
                alt="GT Autohaus logo – Luxury Car Service Centre Kochi"
                className="footer__logo"
                width="180"
                height="54"
                loading="lazy"
              />
            </Link>
            <p className="footer__tagline">
              Premium car service in Kochi. Delivering precision, performance, and peace of mind
              for every vehicle — from family cars to high-end luxury marques.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h3 className="footer__heading">Quick Links</h3>
            <ul className="footer__link-list">
              <li><Link to="/" className="footer__link" id="footer-link-home">Home</Link></li>
              <li><Link to="/services" className="footer__link" id="footer-link-services">Services</Link></li>
              <li><Link to="/contact" className="footer__link" id="footer-link-contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services Summary */}
          <div className="footer__col">
            <h3 className="footer__heading">Our Expertise</h3>
            <ul className="footer__link-list">
              <li><span className="footer__text-item">Luxury Car Repair</span></li>
              <li><span className="footer__text-item">Advanced Diagnostics</span></li>
              <li><span className="footer__text-item">Vehicle Maintenance</span></li>
              <li><span className="footer__text-item">Exotic Car Service</span></li>
            </ul>
          </div>

          {/* Contact Snippet */}
          <div className="footer__col">
            <h3 className="footer__heading">Get in Touch</h3>
            <address className="footer__address">
              <p>Kochi, Kerala, India</p>
              <p>
                <a href="mailto:info@gtautohaus.com" className="footer__link">
                  info@gtautohaus.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {currentYear} GT Autohaus. All rights reserved.
          </p>
          <p className="footer__credit">
            Precision Engineering. Uncompromising Quality.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
