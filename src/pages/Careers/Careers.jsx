import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { getStoredJobs, addApplication } from '../../data/careersData';
import Toast from '../../components/Toast/Toast';
import './Careers.css';

export default function Careers() {
  const { t, lang } = useLanguage();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [expandedJobId, setExpandedJobId] = useState(null);
  
  // Application modal state
  const [activeJobForApp, setActiveJobForApp] = useState(null);
  const [form, setForm] = useState({
    candidateName: '',
    email: '',
    phone: '',
    linkedin: '',
    coverNote: ''
  });
  const [cvFile, setCvFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setJobs(getStoredJobs().filter(j => j.status === 'Active' || !j.status));
  }, []);

  // Filter options
  const departments = ['All', ...new Set(jobs.map(j => j.department))];
  const locations = ['All', ...new Set(jobs.map(j => j.location))];

  const filteredJobs = jobs.filter(job => {
    const matchSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchDept = selectedDept === 'All' || job.department === selectedDept;
    const matchLoc = selectedLoc === 'All' || job.location === selectedLoc;

    return matchSearch && matchDept && matchLoc;
  });

  // Handle File Upload & Base64 conversion
  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      alert(lang === 'en' ? 'Please upload a PDF or DOC/DOCX file.' : 'Bitte laden Sie eine PDF- oder DOC/DOCX-Datei hoch.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert(lang === 'en' ? 'File exceeds 10MB limit.' : 'Datei überschreitet das Limit von 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setCvFile({
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        dataUrl: ev.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!form.candidateName || !form.email || !form.phone) {
      alert(lang === 'en' ? 'Please fill in all required fields.' : 'Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    if (!cvFile) {
      alert(lang === 'en' ? 'Please attach your CV / Resume before submitting.' : 'Bitte fügen Sie Ihren Lebenslauf (CV) an.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      addApplication({
        jobId: activeJobForApp?.id || 'spontaneous',
        jobTitle: activeJobForApp?.title || (lang === 'en' ? 'Spontaneous Application' : 'Initiativbewerbung'),
        candidateName: form.candidateName,
        email: form.email,
        phone: form.phone,
        linkedin: form.linkedin,
        coverNote: form.coverNote,
        cvFile: cvFile
      });

      setSubmitting(false);
      setActiveJobForApp(null);
      setForm({ candidateName: '', email: '', phone: '', linkedin: '', coverNote: '' });
      setCvFile(null);
      setToast({
        message: t('careers_success_msg'),
        type: 'success'
      });
    }, 600);
  };

  return (
    <div className="careers-page">
      {/* Hero Banner — Home Theme */}
      <section className="careers-hero">
        <div className="padding-global">
          <div className="container-large">
            <motion.div
              className="careers-hero-inner"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="careers-badge">
                <span className="badge-dot" />
                {t('careers_hero_badge')}
              </div>
              <h1 className="careers-hero-title">{t('careers_hero_title')}</h1>
              <p className="careers-hero-sub">{t('careers_hero_subtitle')}</p>

              {/* General Spontaneous Application CTA */}
              <div className="careers-spontaneous-bar">
                <div className="spontaneous-info">
                  <span className="spontaneous-tag">{lang === 'en' ? 'OPEN TALENT NETWORK' : 'TALENT NETWORK'}</span>
                  <p>{lang === 'en' ? 'Don’t see your exact role? Submit a spontaneous CV application to our executive team.' : 'Keine passende Stelle gefunden? Reichen Sie eine Initiativbewerbung ein.'}</p>
                </div>
                <button
                  className="btn-wine-pill"
                  onClick={() => setActiveJobForApp({ id: 'spontaneous', title: lang === 'en' ? 'Spontaneous Application' : 'Initiativbewerbung' })}
                >
                  {lang === 'en' ? 'Upload CV directly →' : 'CV direkt hochladen →'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Search & Listings Section */}
      <section className="careers-listings-section" id="open-positions">
        <div className="padding-global">
          <div className="container-large">
            <div className="careers-section-header">
              <div>
                <span className="careers-section-caption">
                  {lang === 'en' ? 'Current Opportunities' : 'Aktuelle Stellenangebote'}
                </span>
                <h2 className="careers-section-h2">
                  {lang === 'en' ? 'Explore Open Positions' : 'Offene Positionen erkunden'}
                </h2>
              </div>
              <div className="careers-count-badge">
                {filteredJobs.length} {filteredJobs.length === 1 ? (lang === 'en' ? 'Position' : 'Stelle') : (lang === 'en' ? 'Positions' : 'Stellen')}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="careers-filter-bar">
              <div className="careers-search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder={t('careers_search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="careers-search-input"
                />
                {searchTerm && (
                  <button className="search-clear-btn" onClick={() => setSearchTerm('')}>✕</button>
                )}
              </div>

              <div className="careers-select-row">
                <div className="careers-select-wrap">
                  <label htmlFor="dept-filter" className="sr-only">Department</label>
                  <select
                    id="dept-filter"
                    className="careers-select"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                  >
                    <option value="All">{t('careers_all_departments')}</option>
                    {departments.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="careers-select-wrap">
                  <label htmlFor="loc-filter" className="sr-only">Location</label>
                  <select
                    id="loc-filter"
                    className="careers-select"
                    value={selectedLoc}
                    onChange={(e) => setSelectedLoc(e.target.value)}
                  >
                    <option value="All">{t('careers_all_locations')}</option>
                    {locations.filter(l => l !== 'All').map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Jobs List Grid */}
            {filteredJobs.length === 0 ? (
              <div className="careers-empty-state">
                <p>{lang === 'en' ? 'No job openings match your filter criteria.' : 'Keine Stellenangebote entsprechen Ihren Kriterien.'}</p>
                <button
                  className="btn-wine-pill"
                  onClick={() => { setSearchTerm(''); setSelectedDept('All'); setSelectedLoc('All'); }}
                >
                  {lang === 'en' ? 'Reset Filters' : 'Filter zurücksetzen'}
                </button>
              </div>
            ) : (
              <div className="careers-job-grid">
                {filteredJobs.map((job) => {
                  const isExpanded = expandedJobId === job.id;
                  return (
                    <motion.div
                      key={job.id}
                      className={`careers-job-card ${isExpanded ? 'is-expanded' : ''}`}
                      layout
                    >
                      <div className="job-card-top">
                        <div className="job-card-meta">
                          <span className="job-dept-pill">{job.department}</span>
                          <span className="job-type-pill">{job.type}</span>
                          <span className="job-exp-pill">{job.experience}</span>
                        </div>
                        <span className="job-location-text">{job.location}</span>
                      </div>

                      <h3 className="job-card-title">{job.title}</h3>
                      <p className="job-card-desc">{job.description}</p>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            className="job-card-expanded-body"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h4 className="expanded-heading">{lang === 'en' ? 'Requirements & Qualifications:' : 'Anforderungen & Qualifikationen:'}</h4>
                            <ul className="expanded-req-list">
                              {job.requirements.map((req, idx) => (
                                <li key={idx}>✓ {req}</li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="job-card-actions">
                        <button
                          className="btn-link-details"
                          onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                        >
                          {isExpanded ? (lang === 'en' ? 'Hide Details ▲' : 'Details verbergen ▲') : (lang === 'en' ? 'View Requirements ▼' : 'Anforderungen anzeigen ▼')}
                        </button>
                        <Link
                          className="btn-wine-pill"
                          to={`/careers/${job.id}`}
                        >
                          {t('careers_apply_now')} →
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application & CV Upload Modal */}
      <AnimatePresence>
        {activeJobForApp && (
          <div className="careers-modal-backdrop" onClick={() => setActiveJobForApp(null)}>
            <motion.div
              className="careers-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="modal-header">
                <div>
                  <span className="modal-badge">{lang === 'en' ? 'APPLICATION FORM' : 'BEWERBUNGSFORMULAR'}</span>
                  <h3 className="modal-title">{activeJobForApp.title}</h3>
                  {activeJobForApp.location && <p className="modal-sub">{activeJobForApp.location} • {activeJobForApp.department}</p>}
                </div>
                <button className="modal-close-btn" onClick={() => setActiveJobForApp(null)}>✕</button>
              </div>

              <form onSubmit={handleSubmitApplication} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="app-name" className="form-label">{t('careers_full_name')} *</label>
                    <input
                      id="app-name"
                      type="text"
                      required
                      placeholder="e.g. Dr. Julia Hoffmann"
                      className="form-input"
                      value={form.candidateName}
                      onChange={(e) => setForm(p => ({ ...p, candidateName: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="app-email" className="form-label">{t('careers_email')} *</label>
                    <input
                      id="app-email"
                      type="email"
                      required
                      placeholder="j.hoffmann@example.com"
                      className="form-input"
                      value={form.email}
                      onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="app-phone" className="form-label">{t('careers_phone')} *</label>
                    <input
                      id="app-phone"
                      type="tel"
                      required
                      placeholder="+49 170 1234567"
                      className="form-input"
                      value={form.phone}
                      onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="app-linkedin" className="form-label">{t('careers_linkedin')}</label>
                    <input
                      id="app-linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      className="form-input"
                      value={form.linkedin}
                      onChange={(e) => setForm(p => ({ ...p, linkedin: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="app-cover" className="form-label">{t('careers_cover_note')}</label>
                  <textarea
                    id="app-cover"
                    rows={3}
                    placeholder={lang === 'en' ? 'Briefly describe your relevant achievements or experience...' : 'Beschreiben Sie kurz Ihre relevanten Qualifikationen...'}
                    className="form-textarea"
                    value={form.coverNote}
                    onChange={(e) => setForm(p => ({ ...p, coverNote: e.target.value }))}
                  />
                </div>

                {/* CV Upload Box */}
                <div className="form-group">
                  <label className="form-label">{t('careers_upload_cv')} *</label>
                  {!cvFile ? (
                    <div
                      className={`cv-dropzone ${dragOver ? 'is-dragover' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('cv-file-input').click()}
                    >
                      <div className="dropzone-icon">📄</div>
                      <p className="dropzone-text">{t('careers_upload_hint')}</p>
                      <span className="dropzone-sub">PDF, DOC, DOCX — Max 10MB</span>
                    </div>
                  ) : (
                    <div className="cv-file-attached">
                      <div className="cv-file-info">
                        <span className="cv-file-icon">📑</span>
                        <div>
                          <p className="cv-file-name">{cvFile.name}</p>
                          <p className="cv-file-size">{(cvFile.size / 1024).toFixed(1)} KB • {lang === 'en' ? 'Ready to upload' : 'Bereit zum Hochladen'}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="cv-file-remove"
                        onClick={() => setCvFile(null)}
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <input
                    id="cv-file-input"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setActiveJobForApp(null)}
                  >
                    {t('careers_close')}
                  </button>
                  <button
                    type="submit"
                    className="btn-wine-pill"
                    disabled={submitting}
                  >
                    {submitting ? (lang === 'en' ? 'Submitting...' : 'Wird gesendet...') : t('careers_submit_app')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
