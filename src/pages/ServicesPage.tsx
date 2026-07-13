import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import './ServicesPage.css'

interface ServiceCategory {
  title: string
  icon: ReactNode
  image: string
  items: string[]
}

const ServicesPage = () => {
  const pageRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!pageRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.services-hero__content > *',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )
      gsap.fromTo('.services-grid__intro',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-grid__intro',
            start: 'top 85%',
          }
        }
      )
      gsap.fromTo('.service-category-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-grid__categories',
            start: 'top 85%',
          }
        }
      )
      gsap.fromTo('.services-commitment',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-commitment',
            start: 'top 85%',
          }
        }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const categories: ServiceCategory[] = [
    {
      title: 'Engine & Mechanical Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      ),
      image: '/service_engine_mechanical.png',
      items: [
        'Vehicle Engine Diagnostic',
        'Engine Repair & Overhaul',
        'Vehicle Engine Tuning',
        'Tune-Up Service',
        'Oil & Filter Change',
        'General Engine Maintenance',
        'Performance Optimization',
        'Transmission Repair & Rebuild',
        'Transmission Replacement',
        'Drivetrain Repair',
        'Transmission Diagnostics',
        'Clutch and Gear System Inspection',
        'Vehicle Exhaust System Repair',
        'Vehicle Exhaust System Replacement',
        'Exhaust Inspection',
        'Emission Performance Checks'
      ]
    },
    {
      title: 'Electrical & Diagnostics',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
      image: '/service_electrical_diagnostics.png',
      items: [
        'Vehicle Diagnostics Service',
        'Vehicle Safety & Emissions Inspection',
        'Multi-Point Vehicle Inspection',
        'Performance and System Checks',
        'Electrical Repair & Rewiring',
        'Vehicle Power Window Repair',
        'Lighting & Indicator Repair',
        'Electrical System Diagnostics',
        'Vehicle Battery Maintenance',
        'Vehicle Battery Replacement',
        'Battery Health Check',
        'Charging System Inspection',
        'Electrical System Testing'
      ]
    },
    {
      title: 'Chassis, Brakes & Suspension',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="3" x2="12" y2="8"/>
          <line x1="12" y1="16" x2="12" y2="21"/>
          <line x1="3" y1="12" x2="8" y2="12"/>
          <line x1="16" y1="12" x2="21" y2="12"/>
        </svg>
      ),
      image: '/service_chassis_brakes.png',
      items: [
        'Vehicle Brake Repair & Upgrade',
        'Vehicle Brake Replacement',
        'Brake System Diagnostics',
        'Brake Pad and Disc Replacement',
        'Complete Brake Maintenance',
        'Steering and Suspension Repair',
        'Steering and Suspension Replacement',
        'Steering Wheel Repair',
        'Chassis Repair & Alignment',
        'Suspension Component Inspection',
        'Vehicle Tyre Replacement',
        'Tyre Inspection and Maintenance',
        'Wheel Alignment & Balancing',
        'Tyre Rotation'
      ]
    },
    {
      title: 'Body, Detailing & Climate Control',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
          <path d="M7.5 10.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"/>
          <path d="M11.5 7.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"/>
          <path d="M16.5 9.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"/>
        </svg>
      ),
      image: '/service_body_detailing.png',
      items: [
        'Body Repairs & Scratch Removal',
        'Vehicle Body and Trim Repair/Replacement',
        'Premium Car Painting & Restoration',
        'Rust Repair & Protection',
        'Side View Mirror Repair',
        'Auto Detailing & Waxing',
        'Vehicle Interior Vacuuming & Deep Cleaning',
        'Upholstery & Interior Restoration',
        'Air Conditioning Repair & Service',
        'A/C Filter Replacement & Recharge',
        'Auto Glass & Windshield Repair/Replacement',
        'Vehicle Water Leak Repair',
        'Wiper Blade & Component Replacement'
      ]
    }
  ]

  const filteredCategories = categories.map(cat => {
    const matchingItems = cat.items.filter(item =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return {
      ...cat,
      items: matchingItems
    }
  }).filter(cat =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) || cat.items.length > 0
  )

  return (
    <div ref={pageRef} className="services-page-wrapper">
      {/* Hero */}
      <section className="services-hero" id="services-hero">
        <div className="services-hero__bg" aria-hidden="true">
          <img
            src="/services_hero_banner.png"
            alt="GT Autohaus Services Banner"
            loading="eager"
          />
        </div>
        <div className="services-hero__overlay" aria-hidden="true"></div>
        <div className="services-hero__content container">
          <span className="section-label">Our Services</span>
          <h1 className="section-heading" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: '1.1' }}>
            Precision <span className="text-orange">Automotive Solutions</span>
          </h1>
          <p className="section-subtext" style={{ maxWidth: '780px' }}>
            At our automotive service center, we provide a complete range of repair, maintenance, diagnostic, and restoration solutions for all types of vehicles, including luxury and premium brands. Our experienced technicians use advanced equipment and industry-leading practices to ensure your vehicle remains safe, reliable, and performs at its best.
          </p>
        </div>
      </section>

      {/* Filter / Search section */}
      <section className="services-search-sec">
        <div className="container">
          <div className="services-search__box glass-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search services or categories (e.g. Engine tuning, alignment)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="services-search__input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="search-clear-btn" aria-label="Clear search">
                &times;
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="services-grid" id="services-list" aria-labelledby="services-heading">
        <div className="container">
          <div className="services-grid__intro text-center">
            <span className="section-label">Service Menu</span>
            <h2 className="section-heading">Explore Our Expertise</h2>
            <p className="section-subtext">
              Browse our fully comprehensive selection of services, categorized for quick access. Use the search bar above to look up specific repair procedures.
            </p>
          </div>

          <div className="services-grid__categories">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, i) => (
                <article className="service-category-card glass-card" key={i} id={`category-card-${i}`}>
                  <div className="category-card__img-container">
                    <img src={cat.image} alt={cat.title} className="category-card__img" loading="lazy" />
                    <div className="category-card__icon-overlay">{cat.icon}</div>
                  </div>
                  <div className="category-card__content">
                    <h3 className="category-card__title">{cat.title}</h3>
                    <ul className="category-card__list">
                      {cat.items.map((item, j) => (
                        <li key={j} className="category-card__list-item">
                          <span className="bullet-point"></span>
                          <span className="item-text">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))
            ) : (
              <div className="services-no-results glass-card text-center">
                <p>No services match your search term &quot;{searchQuery}&quot;.</p>
                <button onClick={() => setSearchQuery('')} className="btn-outline btn-sm">Reset Search</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="services-commitment" id="our-commitment-section">
        <div className="services-commitment__bg" aria-hidden="true">
          <img src="/promise_footer_bg.png" alt="" loading="lazy" />
        </div>
        <div className="services-commitment__overlay" aria-hidden="true"></div>
        <div className="container services-commitment__content">
          <span className="section-label">Our Commitment</span>
          <h2 className="section-heading">Workmanship Backed by Pride</h2>
          <p className="commitment-text">
            We are committed to delivering exceptional automotive care through expert workmanship, genuine parts, transparent communication, and customer-focused service. Whether it&apos;s a routine service, a major repair, or a complete restoration, our team ensures that your vehicle receives the highest level of attention and care.
          </p>
          <div className="commitment-cta">
            <Link to="/contact" className="btn-primary">
              Book a Service Appointment
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage
