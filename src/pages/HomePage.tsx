import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroCanvas from '../components/HeroCanvas'
import './HomePage.css'

gsap.registerPlugin(ScrollTrigger)

/* ===== HERO SECTION ===== */
const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null)

  // GSAP entrance
  useEffect(() => {
    if (!heroRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.hero__text-col > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, delay: 0.3 })
        .fromTo('.hero__image-col', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, '-=0.6')
        .fromTo('.hero__scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.3')
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" ref={heroRef} id="hero-section" aria-label="Hero banner – Premium car service Kochi">
      {/* Content */}
      <div className="hero__content container">
        <div className="hero__grid">
          <div className="hero__text-col">
            <span className="hero__label section-label">Lottus Automotives</span>
            <h1 className="hero__title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', lineHeight: '1.15' }}>
              Drive with Confidence.<br />
              <span className="text-orange">Service with Excellence.</span>
            </h1>
            <p className="hero__description" style={{ fontSize: '0.98rem', lineHeight: '1.75' }}>
              Experience complete automotive care in Kochi, from routine maintenance to advanced diagnostics
              and luxury vehicle repairs. Our skilled technicians, state-of-the-art equipment, and commitment
              to quality ensure that every journey begins with a vehicle you can trust.
            </p>
            <div className="hero__cta-group">
              <Link to="/services" className="btn-primary" id="hero-cta-services">
                Explore Services
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <Link to="/contact" className="btn-outline" id="hero-cta-contact">
                Book a Consultation
              </Link>
            </div>
          </div>
          <div className="hero__image-col">
            <HeroCanvas
              images={[
                '/hero_car_display.png',
                '/hero_car_display_2.png',
                '/hero_car_display_3.png'
              ]}
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero__scroll-indicator" aria-hidden="true">
        <div className="hero__scroll-line"></div>
      </div>
    </section>
  )
}

/* ===== ABOUT SECTION ===== */
const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.about__image-wrapper',
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
      gsap.fromTo('.about__text',
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="about section-padding" ref={sectionRef} id="about-section" aria-labelledby="about-heading">
      <div className="container">
        <div className="about__grid">
          <div className="about__image-wrapper">
            <img
              src="/WhatsApp Image 2026-07-12 at 09.42.36.jpeg"
              alt="Certified technician inspecting a luxury car engine – Lottus Automotives workshop Kochi"
              className="about__image"
              loading="lazy"
              width="600"
              height="400"
            />
            <div className="about__image-accent" aria-hidden="true"></div>
          </div>
          <div className="about__text">
            <span className="section-label">About Us</span>
            <h2 className="section-heading" id="about-heading">
              Full-Service Automotive Excellence in <span className="text-orange">Kochi</span>
            </h2>
            <p className="section-subtext">
              We are a full-service automotive center dedicated to keeping your vehicle safe, reliable,
              and performing at its peak. By combining technical expertise, genuine parts, and transparent
              service, we deliver repairs and maintenance that exceed expectations. Whether you drive a
              family car or a high-end luxury vehicle, your satisfaction is our priority.
            </p>
            <div className="about__stats">
              <div className="about__stat">
                <span className="about__stat-number">15+</span>
                <span className="about__stat-label">Years Experience</span>
              </div>
              <div className="about__stat">
                <span className="about__stat-number">5000+</span>
                <span className="about__stat-label">Vehicles Serviced</span>
              </div>
              <div className="about__stat">
                <span className="about__stat-number">100%</span>
                <span className="about__stat-label">Customer Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===== WHY CHOOSE US ===== */
const whyChooseData = [
  {
    image: '/why/why_tech.png',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    title: 'Certified & Experienced Technicians',
    desc: 'Our team comprises industry-certified professionals with years of hands-on expertise in servicing both everyday and high-performance vehicles.',
  },
  {
    image: '/why/why_diag.png',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
        <path d="M6 8h.01M10 8h.01"/>
      </svg>
    ),
    title: 'Advanced Diagnostic & Repair Equipment',
    desc: 'We invest in the latest diagnostic tools and equipment to ensure accurate identification of issues and precise, efficient repairs.',
  },
  {
    image: '/why/why_parts.png',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Genuine Parts & Premium Materials',
    desc: "We use only genuine OEM parts and premium materials to preserve your vehicle's integrity, performance, and warranty.",
  },
  {
    image: '/why/why_comm.png',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Clear Communication & Timely Service',
    desc: 'We keep you informed at every stage. Transparent pricing, regular updates, and on-time delivery are our standard operating principles.',
  },
  {
    image: '/why/why_vehicles.png',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C12.9 5.5 11.6 5 10.1 5H5.8C4.5 5 3.4 5.9 3.1 7.1L2 12v4c0 .6.4 1 1 1h1"/>
        <circle cx="7" cy="17" r="2"/>
        <circle cx="17" cy="17" r="2"/>
      </svg>
    ),
    title: 'Expertise in Everyday & Luxury Vehicles',
    desc: 'From routine family car maintenance to complex exotic car service, we have the knowledge and tools to handle every marque with care.',
  },
  {
    image: '/why/why_warranty.png',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"/>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    ),
    title: 'Warranty-Backed Workmanship',
    desc: 'All our diagnostic, repair, and replacement services are covered by our quality guarantee, ensuring complete peace of mind.',
  },
]

const WhyChooseSection = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.why-card',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.why__cards',
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="why" ref={sectionRef} id="why-choose-section" aria-labelledby="why-heading">
      <div className="container">
        <div className="why__header">
          <span className="section-label">Why Choose Us</span>
          <h2 className="section-heading" id="why-heading">
            The <span className="text-orange">Lottus</span> Advantage
          </h2>
          <p className="section-subtext">
            Discover why discerning vehicle owners across Kerala trust Lottus Automotives for their premium car service needs.
          </p>
        </div>
        <div className="why__cards">
          {whyChooseData.map((item, i) => (
            <article className="why-card glass-card" key={i} id={`why-card-${i}`}>
              <div className="why-card__img-container">
                <img src={item.image} alt={item.title} className="why-card__img" loading="lazy" />
                <div className="why-card__icon-overlay">{item.icon}</div>
              </div>
              <div className="why-card__content">
                <h3 className="why-card__title">{item.title}</h3>
                <p className="why-card__desc">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===== FEATURED EXPERTISE (Luxury Brands) ===== */
const brandRow1 = [
  { name: 'Audi', logo: '/logos/logo_audi.png', keyword: 'audi service centre kochi' },
  { name: 'BMW', logo: '/logos/logo_bmw.png', keyword: 'bmw service centre kochi' },
  { name: 'Mercedes-Benz', logo: '/logos/logo_mercedes.png', keyword: 'mercedes service kochi' },
  { name: 'Land Rover', logo: '/logos/logo_landrover.png', keyword: 'land rover service kochi' },
]

const brandRow2 = [
  { name: 'Jaguar', logo: '/logos/logo_jaguar.png', keyword: 'jaguar service kochi' },
  { name: 'Porsche', logo: '/logos/logo_porsche.png', keyword: 'porsche service centre kochi' },
  { name: 'Volvo', logo: '/logos/logo_volvo.png', keyword: 'volvo service kochi' },
  { name: 'Rolls-Royce', logo: '/logos/logo_rollsroyce.png', keyword: 'rolls royce service kochi' },
]

const FeaturedExpertise = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.brand-badge',
        { scale: 0.85, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.brands__marquee-wrapper',
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="brands" ref={sectionRef} id="featured-expertise-section" aria-labelledby="brands-heading">
      <div className="brands__bg-image" aria-hidden="true">
        <img src="/luxury_brands_bg.png" alt="" loading="lazy" />
      </div>
      <div className="brands__overlay" aria-hidden="true"></div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="brands__header">
          <span className="section-label">Featured Expertise</span>
          <h2 className="section-heading" id="brands-heading">
            Trusted by Owners of the World&apos;s <span className="text-orange">Finest Marques</span>
          </h2>
          <p className="section-subtext">
            As a luxury car service centre, we specialise in servicing and repairing high-performance and exotic vehicles
            from the most prestigious automotive brands, including BMW, Audi, and Porsche service centre operations in Kochi.
          </p>
        </div>
      </div>
      
      {/* Moving Marquee in 2 Rows */}
      <div className="brands__marquee-wrapper" style={{ position: 'relative', zIndex: 2 }}>
        <div className="brands__marquee-row">
          <div className="brands__marquee-track">
            {[...brandRow1, ...brandRow1, ...brandRow1, ...brandRow1].map((brand, i) => (
              <div className="brand-badge" key={i} title={brand.keyword}>
                <div className="brand-badge__logo-wrapper">
                  <img src={brand.logo} alt={`${brand.name} logo`} className="brand-badge__logo" loading="lazy" />
                </div>
                <span className="brand-badge__name">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="brands__marquee-row">
          <div className="brands__marquee-track brands__marquee-track--reverse">
            {[...brandRow2, ...brandRow2, ...brandRow2, ...brandRow2].map((brand, i) => (
              <div className="brand-badge" key={i} title={brand.keyword}>
                <div className="brand-badge__logo-wrapper">
                  <img src={brand.logo} alt={`${brand.name} logo`} className="brand-badge__logo" loading="lazy" />
                </div>
                <span className="brand-badge__name">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===== CUSTOMER PROMISE ===== */
const CustomerPromise = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.promise__inner',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="promise" ref={sectionRef} id="customer-promise-section" aria-labelledby="promise-heading">
      <div className="container">
        <div className="promise__inner">
          <div className="promise__accent-line" aria-hidden="true"></div>
          <span className="section-label">Our Promise</span>
          <h2 className="section-heading" id="promise-heading">
            A Commitment to <span className="text-orange">Excellence</span>
          </h2>
          <p className="promise__text">
            Every vehicle entrusted to us receives meticulous attention, honest recommendations,
            and workmanship backed by a dedication to excellence. We strive to build lasting
            relationships with our customers by providing dependable service and an outstanding
            ownership experience.
          </p>
          <Link to="/contact" className="btn-primary" id="promise-cta">
            Experience the Difference
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ===== GALLERY SECTION ===== */
const galleryImages = [
  '/WhatsApp Image 2026-07-12 at 09.42.31.jpeg',
  '/WhatsApp Image 2026-07-12 at 09.42.32.jpeg',
  '/WhatsApp Image 2026-07-12 at 09.42.33.jpeg',
  '/WhatsApp Image 2026-07-12 at 09.42.34.jpeg',
  '/WhatsApp Image 2026-07-12 at 09.42.35.jpeg',
  '/WhatsApp Image 2026-07-12 at 09.42.37.jpeg',
]

const GallerySection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.gallery__header',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return
    const scrollAmount = 350
    const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
    gsap.to(container, {
      scrollLeft: targetScroll,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  return (
    <section className="gallery" ref={sectionRef} id="gallery-section" aria-labelledby="gallery-heading">
      <div className="container">
        <div className="gallery__header-wrapper">
          <div className="gallery__header">
            <span className="section-label">Gallery</span>
            <h2 className="section-heading" id="gallery-heading">
              Our <span className="text-orange">Premium Workshop</span> in Action
            </h2>
            <p className="section-subtext">
              Take a look inside Lottus Automotives Kochi. We maintain a clean, organized, and state-of-the-art facility to ensure your vehicle receives top-tier care.
            </p>
          </div>
          <div className="gallery__controls">
            <button
              onClick={() => handleScroll('left')}
              className="gallery__btn"
              aria-label="Scroll gallery left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="gallery__btn"
              aria-label="Scroll gallery right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="gallery__marquee-wrapper" ref={scrollContainerRef}>
        <div className="gallery__marquee-track">
          {galleryImages.map((img, i) => (
            <div className="gallery__item" key={i}>
              <img
                src={img}
                alt="Lottus Automotives professional workshop facility Kochi"
                className="gallery__img"
                loading="lazy"
              />
              <div className="gallery__item-overlay">
                <div className="gallery__item-accent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===== REVIEWS SECTION ===== */
const reviews = [
  {
    name: 'Anandhu Krishna',
    rating: 5,
    text: 'Excellent service! Handed over my BMW 5 Series for suspension work and general service. The team diagnosed the issue precisely and fixed it. Highly recommended for luxury car service in Kochi.',
    date: '2 weeks ago',
    avatar: 'A'
  },
  {
    name: 'Rohan Mathew',
    rating: 5,
    text: 'The most reliable luxury car workshop in Kerala. Extremely professional staff, transparent pricing, and state-of-the-art diagnostic tools. Serviced my Audi A6 here and the experience was flawless.',
    date: '1 month ago',
    avatar: 'R'
  },
  {
    name: 'Deepak Menon',
    rating: 5,
    text: 'Outstanding customer service and high-quality workmanship. They took care of my Porsche Cayenne with utmost dedication. Very clean facility and expert technicians.',
    date: '3 months ago',
    avatar: 'D'
  }
]

const ReviewsSection = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.reviews__header',
        { y: 45, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      )
      gsap.fromTo('.reviews__card',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="reviews" ref={sectionRef} id="google-reviews" aria-labelledby="reviews-heading">
      <div className="container">
        <div className="reviews__header">
          <span className="section-label">Testimonials</span>
          <h2 className="section-heading" id="reviews-heading">
            Trusted by <span className="text-orange">Luxury Car Owners</span>
          </h2>
          <div className="reviews__google-badge">
            <span className="reviews__rating-num">4.9</span>
            <div className="reviews__stars">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="reviews__star-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="reviews__count">on Google Reviews</span>
          </div>
        </div>

        <div className="reviews__grid">
          {reviews.map((rev, idx) => (
            <div className="reviews__card glass-card" key={idx}>
              <div className="reviews__card-top">
                <div className="reviews__reviewer">
                  <div className="reviews__avatar">{rev.avatar}</div>
                  <div>
                    <h3 className="reviews__name">{rev.name}</h3>
                    <span className="reviews__date">{rev.date}</span>
                  </div>
                </div>
                <div className="reviews__stars">
                  {[...Array(rev.rating)].map((_, i) => (
                    <svg key={i} className="reviews__star-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="reviews__text">&ldquo;{rev.text}&rdquo;</p>
              <div className="reviews__card-google-logo">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.7 0 3.2.6 4.4 1.8l3.3-3.3C17.7 1.6 15 1 12 1 7.3 1 3.4 3.7 1.5 7.7l3.9 3C6.3 7.8 8.9 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.1-2 3.7-4.9 3.7-8.6z" />
                  <path fill="#FBBC05" d="M5.4 10.7c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2L1.5 3.7C.5 5.6 0 7.8 0 10.1s.5 4.5 1.5 6.4l3.9-3c-.2-.6-.3-1.3-.3-2.1z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 7.9-2.9l-3.7-2.9c-1.1.7-2.5 1.2-4.2 1.2-3.1 0-5.7-2.1-6.6-4.9l-3.9 3C3.4 20.3 7.3 23 12 23z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===== HOME PAGE ===== */
const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <HeroSection />
      <AboutSection />
      <div className="section-divider" aria-hidden="true" />
      <WhyChooseSection />
      <div className="section-divider" aria-hidden="true" />
      <GallerySection />
      <div className="section-divider" aria-hidden="true" />
      <FeaturedExpertise />
      <div className="section-divider" aria-hidden="true" />
      <CustomerPromise />
      <div className="section-divider" aria-hidden="true" />
      <ReviewsSection />
    </>
  )
}

export default HomePage
