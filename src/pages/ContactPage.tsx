import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './ContactPage.css'

const ContactPage = () => {
  const pageRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!pageRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-hero__content > *',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )
      gsap.fromTo('.contact__form-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
      )
      gsap.fromTo('.contact__info-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.6 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div ref={pageRef}>
      {/* Hero with new banner */}
      <section className="contact-hero" id="contact-hero">
        <div className="contact-hero__bg" aria-hidden="true">
          <img
            src="/contact_hero_banner.png"
            alt="Premium automotive service reception at GT Autohaus Kochi"
            loading="eager"
          />
        </div>
        <div className="contact-hero__overlay" aria-hidden="true"></div>
        <div className="contact-hero__content container">
          <span className="section-label">Get in Touch</span>
          <h1 className="section-heading" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}>
            Let&apos;s <span className="text-orange">Start a Conversation</span>
          </h1>
          <p className="section-subtext">
            Whether you need to schedule a service appointment, request a quote for luxury car repair,
            or simply have a question — our team is ready to assist.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact" id="contact-form-section" aria-labelledby="contact-heading">
        <div className="container">
          <div className="contact__grid">
            {/* Form */}
            <div className="contact__form-card glass-card">
              {submitted ? (
                <div className="contact__success">
                  <div className="contact__success-icon">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <h3>Thank You!</h3>
                  <p>We&apos;ve received your message and will get back to you shortly.</p>
                </div>
              ) : (
                <>
                  <h2 className="contact__form-title" id="contact-heading">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="contact__form">
                    <div className="contact__field">
                      <label htmlFor="contact-name" className="contact__label">Full Name</label>
                      <input
                        type="text"
                        id="contact-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="contact__input"
                      />
                    </div>
                    <div className="contact__field-row">
                      <div className="contact__field">
                        <label htmlFor="contact-email" className="contact__label">Email</label>
                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="you@email.com"
                          className="contact__input"
                        />
                      </div>
                      <div className="contact__field">
                        <label htmlFor="contact-phone" className="contact__label">Phone</label>
                        <input
                          type="tel"
                          id="contact-phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="contact__input"
                        />
                      </div>
                    </div>
                    <div className="contact__field">
                      <label htmlFor="contact-vehicle" className="contact__label">Vehicle Make &amp; Model</label>
                      <input
                        type="text"
                        id="contact-vehicle"
                        name="vehicle"
                        value={formData.vehicle}
                        onChange={handleChange}
                        placeholder="e.g. BMW 5 Series"
                        className="contact__input"
                      />
                    </div>
                    <div className="contact__field">
                      <label htmlFor="contact-message" className="contact__label">Message</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Tell us about your service needs..."
                        className="contact__input contact__textarea"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn-primary" id="contact-submit">
                      Send Message
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Info Cards */}
            <div className="contact__info-card">
              <div className="contact__info-item glass-card">
                <div className="contact__info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3 className="contact__info-title">Location</h3>
                <p className="contact__info-text">Kochi, Kerala, India</p>
              </div>
              <div className="contact__info-item glass-card">
                <div className="contact__info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <h3 className="contact__info-title">Email</h3>
                <p className="contact__info-text">
                  <a href="mailto:info@gtautohaus.com">info@gtautohaus.com</a>
                </p>
              </div>
              <div className="contact__info-item glass-card">
                <div className="contact__info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <h3 className="contact__info-title">Working Hours</h3>
                <p className="contact__info-text">Mon – Sat: 9:00 AM – 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
