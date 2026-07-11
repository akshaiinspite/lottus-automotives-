import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HomePage.css'

gsap.registerPlugin(ScrollTrigger)

/* ===== HERO SECTION ===== */
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const slides = ['/hero_slide_1.png', '/hero_slide_2.png', '/hero_slide_3.png']

  // Ken Burns slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  // GSAP entrance
  useEffect(() => {
    if (!heroRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.hero__label', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 })
        .fromTo('.hero__title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.4')
        .fromTo('.hero__description', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
        .fromTo('.hero__cta-group', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
        .fromTo('.hero__scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.3')
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" ref={heroRef} id="hero-section" aria-label="Hero banner – Premium car service Kochi">
      {/* Background Slideshow */}
      <div className="hero__slideshow" aria-hidden="true">
        {slides.map((src, i) => (
          <div
            key={i}
            className={`hero__slide ${i === currentSlide ? 'hero__slide--active' : ''}`}
          >
            <img
              src={src}
              alt={`Premium automotive service environment ${i + 1}`}
              className="hero__slide-img"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="hero__overlay" aria-hidden="true"></div>

      {/* Content */}
      <div className="hero__content container">
        <span className="hero__label section-label">Lottus Automotives</span>
        <h1 className="hero__title">
          Drive with Confidence.<br />
          <span className="text-orange">Service with Excellence.</span>
        </h1>
        <p className="hero__description">
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
              src="/about_workshop.png"
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
      <FeaturedExpertise />
      <div className="section-divider" aria-hidden="true" />
      <CustomerPromise />
    </>
  )
}

export default HomePage
