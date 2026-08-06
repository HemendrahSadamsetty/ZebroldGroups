import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getStoredJobs, addApplication } from '../../data/careersData';
import { sendApplicationEmail } from '../../services/emailService';
import Toast from '../../components/Toast/Toast';
import SEO from '../../components/SEO/SEO';
import './JobDetails.css';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  
  const [job, setJob] = useState(null);
  
  const [form, setForm] = useState({
    candidateName: '',
    email: '',
    phone: '',
    college: '',
    linkedin: '',
    portfolio: '',
    coverNote: ''
  });
  const [cvFile, setCvFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const jobs = getStoredJobs();
    const foundJob = jobs.find(j => j.id === jobId);
    if (foundJob) {
      setJob(foundJob);
    }
  }, [jobId]);

  if (!job) {
    return (
      <div className="job-details-page not-found">
        <div className="padding-global">
          <div className="container-small">
            <h2>{lang === 'en' ? 'Job not found' : 'Stelle nicht gefunden'}</h2>
            <button className="btn-wine-pill" onClick={() => navigate('/careers')}>
              {lang === 'en' ? '← Back to Careers' : '← Zurück zur Karriere'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowed.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc') && !file.name.endsWith('.txt') && !file.name.endsWith('.rtf')) {
      alert(lang === 'en' ? 'Please upload a PDF, DOC, DOCX, TXT or RTF file.' : 'Bitte laden Sie eine PDF, DOC, DOCX, TXT oder RTF-Datei hoch.');
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
    if (!form.candidateName || !form.email || !form.phone || !form.college) {
      alert(lang === 'en' ? 'Please fill in all required fields.' : 'Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    if (!cvFile) {
      alert(lang === 'en' ? 'Please attach your Resume/CV before submitting.' : 'Bitte fügen Sie Ihren Lebenslauf (CV) an.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      addApplication({
        jobId: job.id,
        jobTitle: job.title,
        candidateName: form.candidateName,
        email: form.email,
        phone: form.phone,
        linkedin: form.linkedin,
        college: form.college,
        portfolio: form.portfolio,
        coverNote: form.coverNote,
        cvFile: cvFile
      });

      sendApplicationEmail({
        candidateName: form.candidateName,
        email: form.email,
        phone: form.phone,
        jobTitle: job.title,
        department: job.department,
        coverNote: form.coverNote,
        cvFileName: cvFile?.name,
      });

      setSubmitting(false);
      setForm({ candidateName: '', email: '', phone: '', college: '', linkedin: '', portfolio: '', coverNote: '' });
      setCvFile(null);
      setToast({
        message: t('careers_success_msg'),
        type: 'success'
      });
    }, 600);
  };

  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location
      }
    },
    "hiringOrganization": {
      "@type": "Corporation",
      "name": "Zebrold International Holdings Limited",
      "alternateName": ["Zebrold IHL", "Zebrold Group"],
      "sameAs": "https://www.zebrold.de"
    },
    "employmentType": job.type || "FULL_TIME",
    "datePosted": job.datePosted || "2026-08-01"
  };

  return (
    <div className="job-details-page">
      <SEO 
        title={`${job.title} | Zebrold International Holdings Limited (Zebrold IHL)`}
        description={`Career Opportunity: ${job.title} in ${job.location} (${job.department}) at Zebrold International Holdings Limited (Zebrold IHL). Apply today.`}
        keywords={`${job.title}, ${job.department}, ${job.location} jobs, Zebrold careers, Zebrold IHL jobs, Zebrold International Holdings Limited vacancies`}
        url={`/careers/${job.id}`}
        schemaData={jobSchema}
      />
      <section className="job-details-header">
        <div className="padding-global">
          <div className="container-large">
            <div className="job-breadcrumbs">
              <Link to="/">Home</Link> &gt; <Link to="/careers">Careers</Link> &gt; <span>{job.title}</span>
            </div>
            
            <h1 className="job-details-title">{job.title}</h1>
            
            <div className="job-details-meta">
              <span className="job-meta-item">{job.location}</span>
              <span className="job-meta-item">{job.type}</span>
              <span className="job-meta-item">{job.department}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="job-details-split-section">
        <div className="padding-global">
          <div className="container-large job-split-layout">
            
            {/* Left Column: Description */}
            <div className="job-details-left">
              <div className="job-description-block">
                <h2>{lang === 'en' ? 'Job Description' : 'Stellenbeschreibung'}</h2>
                <div className="job-quick-facts">
                  {job.internshipType && <p><strong>{lang === 'en' ? 'Internship Type' : 'Praktikumsart'}:</strong> {job.internshipType}</p>}
                  {job.duration && <p><strong>{lang === 'en' ? 'Duration' : 'Dauer'}:</strong> {job.duration}</p>}
                  {job.stipend && <p><strong>{lang === 'en' ? 'Stipend' : 'Vergütung'}:</strong> {job.stipend}</p>}
                  {job.conversion && <p><strong>{lang === 'en' ? 'Conversion' : 'Übernahme'}:</strong> {job.conversion}</p>}
                  {!job.internshipType && <p><strong>{lang === 'en' ? 'Experience Level' : 'Erfahrungslevel'}:</strong> {job.experience}</p>}
                </div>
                
                <h3 className="section-subheading">{lang === 'en' ? 'Role Summary' : 'Zusammenfassung der Rolle'}</h3>
                <p>{job.roleSummary || job.description}</p>
              </div>

              {(job.keyResponsibilities || job.requirements) && (
                <div className="job-requirements-block">
                  <h3 className="section-subheading">{lang === 'en' ? 'Key Responsibilities' : 'Hauptaufgaben'}</h3>
                  <ul className="job-req-list">
                    {(job.keyResponsibilities || job.requirements).map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job.requiredSkills && (
                <div className="job-requirements-block">
                  <h3 className="section-subheading">{lang === 'en' ? 'Required Skills' : 'Erforderliche Fähigkeiten'}</h3>
                  <ul className="job-req-list">
                    {job.requiredSkills.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job.positionExpectations && (
                <div className="job-requirements-block">
                  <h3 className="section-subheading">{lang === 'en' ? 'Position Expectations' : 'Positionserwartungen'}</h3>
                  <ul className="job-req-list">
                    {job.positionExpectations.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Application Form */}
            <div className="job-details-right">
              <form onSubmit={handleSubmitApplication} className="inline-app-form">
                <div className="form-group">
                  <label htmlFor="app-name" className="form-label">{lang === 'en' ? 'Full Name' : 'Vollständiger Name'} <span className="req-star">*</span></label>
                  <input
                    id="app-name"
                    type="text"
                    required
                    className="form-input"
                    value={form.candidateName}
                    onChange={(e) => setForm(p => ({ ...p, candidateName: e.target.value }))}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="app-email" className="form-label">{lang === 'en' ? 'Email' : 'E-Mail'} <span className="req-star">*</span></label>
                  <input
                    id="app-email"
                    type="email"
                    required
                    className="form-input"
                    value={form.email}
                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="app-phone" className="form-label">{lang === 'en' ? 'Phone' : 'Telefon'} <span className="req-star">*</span></label>
                  <input
                    id="app-phone"
                    type="tel"
                    required
                    className="form-input"
                    value={form.phone}
                    onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="app-college" className="form-label">{lang === 'en' ? 'College / University' : 'Hochschule / Universität'} <span className="req-star">*</span></label>
                  <input
                    id="app-college"
                    type="text"
                    required
                    className="form-input"
                    value={form.college}
                    onChange={(e) => setForm(p => ({ ...p, college: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="app-linkedin" className="form-label">{lang === 'en' ? 'LinkedIn Profile' : 'LinkedIn-Profil'}</label>
                  <input
                    id="app-linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    className="form-input"
                    value={form.linkedin}
                    onChange={(e) => setForm(p => ({ ...p, linkedin: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="app-portfolio" className="form-label">{lang === 'en' ? 'Portfolio / Website' : 'Portfolio / Webseite'}</label>
                  <input
                    id="app-portfolio"
                    type="url"
                    placeholder="https://..."
                    className="form-input"
                    value={form.portfolio}
                    onChange={(e) => setForm(p => ({ ...p, portfolio: e.target.value }))}
                  />
                </div>

                {/* CV Upload Box */}
                <div className="form-group">
                  <label className="form-label">{lang === 'en' ? 'Resume/CV' : 'Lebenslauf/CV'} <span className="req-star">*</span></label>
                  {!cvFile ? (
                    <div
                      className={`cv-attach-btn ${dragOver ? 'is-dragover' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('cv-file-input').click()}
                    >
                      Attach
                    </div>
                  ) : (
                    <div className="cv-file-attached">
                      <div className="cv-file-info">
                        <span className="cv-file-icon">📑</span>
                        <div>
                          <p className="cv-file-name">{cvFile.name}</p>
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
                  <div className="cv-help-text">Accepted file types: pdf, doc, docx, txt, rtf</div>
                  <input
                    id="cv-file-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    className="sr-only"
                    onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="app-cover" className="form-label">{lang === 'en' ? 'Cover Letter' : 'Anschreiben'}</label>
                  <textarea
                    id="app-cover"
                    rows={4}
                    placeholder={lang === 'en' ? "Tell us why you're interested in this position..." : 'Erzählen Sie uns, warum Sie sich für diese Position interessieren...'}
                    className="form-textarea"
                    value={form.coverNote}
                    onChange={(e) => setForm(p => ({ ...p, coverNote: e.target.value }))}
                  />
                </div>

                <div className="form-footer">
                  <button
                    type="submit"
                    className="submit-app-btn"
                    disabled={submitting}
                  >
                    {submitting ? (lang === 'en' ? 'Submitting...' : 'Wird gesendet...') : (lang === 'en' ? 'Submit Application' : 'Bewerbung absenden')}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
