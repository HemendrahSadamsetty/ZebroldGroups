import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import Toast from '../../components/Toast/Toast';
import { sendContactEmail } from '../../services/emailService';
import SEO from '../../components/SEO/SEO';
import './Contact.css';

const subjects = [
  'Investor Relations',
  'Partnership Enquiry',
  'Media & Press',
  'Career Opportunity',
  'General Enquiry',
];

const offices = [
  { city: 'Frankfurt', country: 'Germany', role: 'Global Headquarters', phone: '+49 69 2100 4800', email: 'info@zebroldgroup.com' },
  { city: 'London', country: 'United Kingdom', role: 'EMEA Operations', phone: '+44 20 3892 4400', email: 'emea@zebroldgroup.com' },
  { city: 'Dubai', country: 'UAE', role: 'Middle East & Africa HQ', phone: '+971 4 305 8800', email: 'mea@zebroldgroup.com' },
  { city: 'Hyderabad', country: 'India', role: 'Tech Park & R&D', phone: '+91 40 6671 0000', email: 'india@zebroldgroup.com' },
  { city: 'Sydney', country: 'Australia', role: 'Australia Pacific HQ', phone: '+61 2 8214 7700', email: 'apac@zebroldgroup.com' },
];

export default function Contact() {
  const pageRef = useScrollReveal();
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: '', company: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ message: 'Your enquiry has been sent. We will respond within 2 business days.', type: 'success' });
    sendContactEmail(form);
    setForm({ name: '', company: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Zebrold Group Headquarters",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bockenheimer Landstrasse 17-19",
      "addressLocality": "Frankfurt am Main",
      "postalCode": "60325",
      "addressCountry": "DE"
    },
    "telephone": "+49 69 2100 4800"
  };

  return (
    <div ref={pageRef} className="contact-page">
      <SEO 
        title="Contact Us | Zebrold Group"
        description="Get in touch with Zebrold Group. Global Headquarters in Frankfurt, with 26 offices worldwide."
        schemaData={schemaData}
      />
      {/* Hero */}
      <section className="page-hero contact-hero" aria-label="Contact hero">
        <div className="container page-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/" className="breadcrumb-link">Home</a>
            <span> / </span>
            <span aria-current="page">Contact</span>
          </nav>
          <h1 className="page-hero-title reveal">Get in Touch</h1>
          <p className="page-hero-sub reveal" data-delay="1">
            For investor relations, partnerships, media enquiries, and general matters.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="section contact-main" aria-labelledby="contact-form-heading">
        <div className="container">
          <div className="contact-grid">
            {/* Form */}
            <div className="contact-form-col">
              <h2 id="contact-form-heading" className="section-title reveal">Send an Enquiry</h2>
              <div className="divider" />
              <form className="contact-form reveal" data-delay="1" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label">Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-company" className="form-label">Company</label>
                    <input
                      id="contact-company"
                      type="text"
                      name="company"
                      className="form-input"
                      placeholder="Your organisation"
                      value={form.company}
                      onChange={handleChange}
                      autoComplete="organization"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">Email Address *</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-subject" className="form-label">Subject *</label>
                  <select
                    id="contact-subject"
                    name="subject"
                    className="form-select"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a topic…</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="form-textarea"
                    placeholder="How can we help you?"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" id="contact-submit-btn" style={{ alignSelf: 'flex-start' }}>
                  Send Enquiry →
                </button>
              </form>
            </div>

            {/* Contact info */}
            <div className="contact-info-col reveal" data-delay="2">
              <h3 className="contact-info-title">Quick Contacts</h3>
              <div className="contact-offices">
                {offices.map(o => (
                  <div key={o.city} className="contact-office-card">
                    <div className="contact-office-header">
                      <span className="contact-office-city">{o.city}</span>
                      <span className="contact-office-country">{o.country}</span>
                    </div>
                    <p className="contact-office-role">{o.role}</p>
                    <div className="contact-office-links">
                      <a href={`tel:${o.phone.replace(/\s/g, '')}`} className="contact-office-link">
                        {o.phone}
                      </a>
                      <a href={`mailto:${o.email}`} className="contact-office-link">
                        {o.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="contact-map-section" aria-label="Location map">
        <div className="contact-map-placeholder">
          <div className="contact-map-overlay">
            <p className="contact-map-label">
              📍 Bockenheimer Landstrasse 17-19, 60325 Frankfurt am Main, Germany
            </p>
          </div>
        </div>
      </section>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
