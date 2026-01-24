'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { FaCcVisa, FaCcMastercard, FaCcStripe, FaMoneyBillWave } from "react-icons/fa6";
import Footer from "@/components/Footer";

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const targetId = target.getAttribute('href');
      if (targetId?.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll as EventListener);
    });

    // Scroll Reveal Animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .feature-list li, .pricing-card, .section-header, .hero-content');
    animatedElements.forEach(el => {
      el.classList.add('fade-in-section');
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll as EventListener);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <nav className="container">
          <div className="logo">James-It</div>
          <ul className="nav-links">
            <li><a href="/about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact" className="btn btn-primary">James-it!</a></li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="hero-section">
          <div className="container hero-grid">
            <div className="hero-content">
              <span className="hero-tag">Winnipeg's Premier Personal Concierge</span>
              <h1>Your Time is Valuable. <br />Let <span className="text-primary">James-It</span> Handle the Rest.</h1>
              <p className="hero-text">
                From courier delivery and secure rides to administrative tasks and custom programming.
                I provide reliable, trustworthy, and continuous assistance tailored to your needs.
              </p>
              <div className="hero-buttons">
                <a href="#contact" className="btn btn-primary">James-it!</a>
                <a href="#services" className="btn btn-secondary">View Services</a>
              </div>
              <div className="trust-indicators">
                <div className="trust-item">
                  <span className="trust-icon">✓</span> Insured & Bondable
                </div>
                <div className="trust-item">
                  <span className="trust-icon">✓</span> 6+ Years Tech Mgmt
                </div>
                <div className="trust-item">
                  <span className="trust-icon">✓</span> 20+ Years software dev & IT
                </div>
                <div className="trust-item">
                  <span className="trust-icon">✓</span> Reliable Vehicle
                </div>
              </div>
            </div>
            <div className="hero-image-wrapper">
              <div className="image-blob"></div>
              {/* Using standard img for now to match CSS styling exactly, or Next Image if adapted */}
              {/* Next Image requires width/height or fill. The CSS uses width:100% max-width:450px. */}
              {/* Adapting to unoptimized img to preserve exact CSS behavior for existing styles is safer for migration */}
              <img src="/assets/james.jpg" alt="James - Your Personal Concierge" className="hero-image" />
              <div className="experience-badge">
                <span className="years">6+</span>
                <span className="label">Years Mgmt<br />Experience</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="section services-section">
          <div className="container">
            <div className="section-header">
              <h2>How Can I Help You?</h2>
              <p>Versatile services tailored to your personal and professional needs.</p>
            </div>

            <div className="services-grid">
              {/* Courier */}
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <h3>Courier Services</h3>
                <p>Sensitive & delicate items up to 75lbs. Fast, secure delivery with live tracking.</p>
              </div>

              {/* Rides */}
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12a6 6 0 0 0 6 6h16a6 6 0 0 0 6-6c0-3.3-2.7-6-6-6zM5 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm14 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" /></svg>
                </div>
                <h3>Private Rides</h3>
                <p>To/from work, school, or private events. Reliable, clean, and punctual transport.</p>
              </div>

              {/* Admin */}
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <h3>Admin & Data</h3>
                <p>Email management, data entry, and computer services. Detailed progress reports included.</p>
              </div>

              {/* Programming */}
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                </div>
                <h3>Tech & Coding</h3>
                <p>Small programming tasks, scripts, and IT troubleshooting by a 6-year Dev Manager.</p>
              </div>

              {/* Shopping */}
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                </div>
                <h3>Personal Shopping</h3>
                <p>Groceries, gifts, or specific items. Careful selection and timely delivery.</p>
              </div>

              {/* Yard Work */}
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <path d="M8 19c0-6 3-11 9-14-6 0-9 5-9 14z" />
                </div>
                <h3>Yard & Home</h3>
                <p>Seasonal yard work, snow removal, and general home assistance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="section features-section">
          <div className="container features-grid">
            <div className="features-content">
              <h2>The James-It Difference</h2>
              <p className="section-sub">Why hire a stranger when you can hire a professional you can trust?</p>

              <ul className="feature-list">
                <li>
                  <div className="feature-marker"></div>
                  <div>
                    <h4>Live Geolocation Tracking</h4>
                    <p>See exactly where I am when I'm on a courier run or coming to pick you up. Peace of mind included.</p>
                  </div>
                </li>
                <li>
                  <div className="feature-marker"></div>
                  <div>
                    <h4>Up-to-the-Minute Reports</h4>
                    <p>For admin and coding tasks, receive live progress updates so you never have to guess the status.</p>
                  </div>
                </li>
                <li>
                  <div className="feature-marker"></div>
                  <div>
                    <h4>Satisfaction Guaranteed</h4>
                    <p>My goal is to make it right. If you're not happy, I'm not finished.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="features-visual">
              <img src="/assets/geo_mockup_popout.png" alt="Live Geolocation Tracking App Mockup" className="feature-mockup" />
              <div className="mockup-bg"></div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="section pricing-section">
          <div className="container">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Simple, Fair Pricing</h3>
                <div className="price">
                  <span className="currency">$</span>29<span className="unit">/hr</span>
                </div>
                <p>For most standard tasks</p>
              </div>
              <div className="pricing-body">
                <ul className="pricing-features">
                  <li>✓ Transparent billing</li>
                  <li>✓ Bulk & long-term rates negotiable</li>
                  <li>✓ Accepts Interac, Visa/Mastercard, Cash</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section contact-section">
          <div className="container">
            <div className="section-header">
              <h2>Get In Touch</h2>
              <p>Ready to reclaim your time? Let's chat.</p>
            </div>

            <div className="contact-grid">
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <small>Location</small>
                    <div>Winnipeg, Manitoba</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div>
                    <small>Phone</small>
                    <div><a href="tel:+13065151212">(306) 515-1212</a></div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div>
                    <small>Email</small>
                    <div><a href="mailto:james@hotdang.ca">james@hotdang.ca</a></div>
                  </div>
                </div>

                <div className="payment-methods" style={{ marginTop: '2rem' }}>
                  <h4>Payment Methods</h4>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', opacity: 0.8, alignItems: 'center', color: '#334155' }}>
                    <img src="/assets/interac.svg" alt="Interac" style={{ height: '24px', width: 'auto' }} />
                    <FaCcVisa title="Visa" style={{ fontSize: '2rem' }} />
                    <FaCcMastercard title="Mastercard" style={{ fontSize: '2rem' }} />
                    <FaCcStripe title="Stripe" style={{ fontSize: '2rem' }} />
                    <FaMoneyBillWave title="Cash" style={{ fontSize: '2rem' }} />
                  </div>
                </div>
              </div>

              {isSubmitted ? (
                <div style={{ backgroundColor: '#F0FDF4', padding: '2rem', borderRadius: '1rem', border: '1px solid #BBF7D0', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>Message Sent!</h3>
                  <p style={{ color: '#15803D', marginBottom: '1.5rem' }}>Thanks for reaching out. I'll get back to you shortly.</p>
                  <button onClick={() => setIsSubmitted(false)} className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = {
                    name: (form.elements.namedItem('name') as HTMLInputElement).value,
                    email: (form.elements.namedItem('email') as HTMLInputElement).value,
                    service_interest: (form.elements.namedItem('service') as HTMLSelectElement).value,
                    message: (form.elements.namedItem('message') as HTMLTextAreaElement).value
                  };

                  try {
                    const response = await fetch('/api/contact', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(formData)
                    });

                    const result = await response.json();

                    if (response.ok) {
                      setIsSubmitted(true);
                      window.scrollTo({ top: document.getElementById('contact')?.offsetTop ? document.getElementById('contact')!.offsetTop - 100 : 0, behavior: 'smooth' });
                    } else {
                      toast.error('Error: ' + result.error);
                    }
                  } catch (error) {
                    toast.error('Something went wrong. Please try again.');
                  }
                }}>
                  <div>
                    <h2>No Obligation Quote</h2>
                    <p>Fill out the form below and I'll get back to you as soon as possible.</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="your@email.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="service">Service Interest</label>
                    <select id="service" defaultValue="">
                      <option value="" disabled>Select a service...</option>
                      <option value="courier">Courier Delivery</option>
                      <option value="rides">Private Rides</option>
                      <option value="admin">Admin / Data Entry</option>
                      <option value="tech">Tech / Programming</option>
                      <option value="shopping">Personal Shopping</option>
                      <option value="yard">Yard Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" rows={4} placeholder="How can I help you?"></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
