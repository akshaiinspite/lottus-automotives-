import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import './ServicesPage.css'

interface ServiceCategory {
  title: string
  icon: ReactNode
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
      title: 'Engine Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      ),
      items: [
        'Vehicle Engine Diagnostic',
        'Engine Repair',
        'Vehicle Engine Tuning',
        'Tune-Up Service',
        'Oil Change',
        'General Engine Maintenance',
        'Performance Optimization'
      ]
    },
    {
      title: 'Air Conditioning Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      items: [
        'Air Conditioning Service',
        'A/C Installation and Repair',
        'A/C Filter Replacement',
        'Air and Cabin Filter Replacement',
        'Vehicle A/C Recharge',
        'Vehicle A/C Replacement',
        'Re-Gas / Recharge Service',
        'Temperature Check',
        'Complete A/C System Inspection'
      ]
    },
    {
      title: 'Battery Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="12" rx="2" ry="2"/>
          <line x1="6" y1="7" x2="6" y2="4"/>
          <line x1="18" y1="7" x2="18" y2="4"/>
          <line x1="6" y1="13" x2="10" y2="13"/>
          <line x1="14" y1="13" x2="18" y2="13"/>
          <line x1="8" y1="11" x2="8" y2="15"/>
        </svg>
      ),
      items: [
        'Vehicle Battery Maintenance',
        'Vehicle Battery Replacement',
        'Battery Health Check',
        'Charging System Inspection',
        'Electrical System Testing'
      ]
    },
    {
      title: 'Brake Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
      ),
      items: [
        'Vehicle Brake Repair',
        'Vehicle Brake Replacement',
        'Brake System Diagnostics',
        'Brake Pad and Disc Replacement',
        'Complete Brake Maintenance'
      ]
    },
    {
      title: 'Steering & Suspension Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
        </svg>
      ),
      items: [
        'Steering and Suspension Repair',
        'Steering and Suspension Replacement',
        'Steering Wheel Repair',
        'Chassis Repair',
        'Wheel Alignment',
        'Suspension Component Inspection'
      ]
    },
    {
      title: 'Transmission & Drivetrain Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
      items: [
        'Transmission Repair',
        'Transmission Replacement',
        'Drivetrain Repair',
        'Transmission Diagnostics',
        'Clutch and Gear System Inspection'
      ]
    },
    {
      title: 'Electrical Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
      items: [
        'Electrical Repair',
        'Vehicle Power Window Repair',
        'Lighting Repair',
        'Electrical System Diagnostics',
        'Wiring and Component Repairs'
      ]
    },
    {
      title: 'Diagnostics & Inspection Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      items: [
        'Vehicle Diagnostics Service',
        'Vehicle Inspection',
        'Vehicle Safety Inspection',
        'Vehicle Emissions Testing',
        'Multi-Point Vehicle Inspection',
        'Performance and System Checks'
      ]
    },
    {
      title: 'Body & Paint Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
          <path d="M7.5 10.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"/>
          <path d="M11.5 7.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"/>
          <path d="M16.5 9.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"/>
        </svg>
      ),
      items: [
        'Body Repairs',
        'Vehicle Body and Trim Repair',
        'Vehicle Body and Trim Replacement',
        'Car Painting',
        'Painting Services',
        'Rust Repair',
        'Body & Trim Restoration',
        'Side View Mirror Repair'
      ]
    },
    {
      title: 'Glass & Windshield Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
          <line x1="15" y1="3" x2="15" y2="21"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="3" y1="15" x2="21" y2="15"/>
        </svg>
      ),
      items: [
        'Auto Glass Repair',
        'Vehicle Glass Replacement',
        'Vehicle Windshield Repair',
        'Vehicle Windshield Replacement',
        'Vehicle Rear Window Replacement',
        'Vehicle Side Window Replacement',
        'Vehicle Sunroof Glass Replacement'
      ]
    },
    {
      title: 'Exhaust System Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/>
          <path d="M12 2v10M18 12H6"/>
        </svg>
      ),
      items: [
        'Vehicle Exhaust System Repair',
        'Vehicle Exhaust System Replacement',
        'Exhaust Inspection',
        'Emission Performance Checks'
      ]
    },
    {
      title: 'Tyre & Wheel Services',
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
      items: [
        'Vehicle Tyre Replacement',
        'Tyre Inspection and Maintenance',
        'Wheel Alignment',
        'Tyre Rotation and Balancing'
      ]
    },
    {
      title: 'Vehicle Maintenance Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      items: [
        'Vehicle Maintenance',
        'General Repairs & Maintenance',
        'Preventive Maintenance Programs',
        'Scheduled Service Packages',
        'Fluid and Filter Replacement',
        'Comprehensive Vehicle Health Checks'
      ]
    },
    {
      title: 'Detailing & Interior Restoration',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
      ),
      items: [
        'Auto Detailing',
        'Car Waxing',
        'Vehicle Interior Vacuuming',
        'Upholstery & Interior Restoration',
        'Interior Cleaning and Protection Treatments'
      ]
    },
    {
      title: 'Customization & Modification Services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
          <line x1="12" y1="22" x2="12" y2="12.01"/>
          <line x1="2" y1="8.5" x2="12" y2="12"/>
          <line x1="22" y1="8.5" x2="12" y2="12"/>
        </svg>
      ),
      items: [
        'Custom Build',
        'Vehicle Modifications',
        'Performance Upgrades',
        'Exterior Enhancement Packages',
        'Interior Customization Solutions'
      ]
    },
    {
      title: 'Water Leak & Special Repairs',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      ),
      items: [
        'Vehicle Water Leak Repair',
        'Wiper Blade Installation',
        'Component Replacement Services',
        'Specialized Repair Solutions'
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
            alt="Lottus Automotives Services Banner"
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
                  <div className="category-card__header">
                    <div className="category-card__icon-box">
                      {cat.icon}
                    </div>
                    <h3 className="category-card__title">{cat.title}</h3>
                  </div>
                  <ul className="category-card__list">
                    {cat.items.map((item, j) => (
                      <li key={j} className="category-card__list-item">
                        <span className="bullet-point"></span>
                        <span className="item-text">{item}</span>
                      </li>
                    ))}
                  </ul>
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
