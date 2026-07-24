import { useState, useCallback, useEffect, useRef } from 'react';
import Toast from '../../components/Toast/Toast';
import { subsidiaries } from '../../data/subsidiaries';
import zebroldLogoMark from '../../assets/zebrold_logo_mark.png';
import { getStoredJobs, saveJobs, getStoredApplications, saveApplications } from '../../data/careersData';
import {
  getExpertise, saveExpertise, EXPERTISE_DEFAULTS,
  getDomains, saveDomains, DOMAINS_DEFAULTS,
  getStats, saveStats, STATS_DEFAULTS,
  getNewsSection, saveNewsSection, NEWS_SECTION_DEFAULTS,
  getAboutScroll, saveAboutScroll, ABOUT_SCROLL_DEFAULTS,
  getCta, saveCta, CTA_DEFAULTS,
  getFaq, saveFaq, FAQ_DEFAULTS,
  getSectionOrder, saveSectionOrder, SECTION_ORDER_DEFAULTS,
  getTicker, saveTicker, TICKER_DEFAULTS,
} from '../../utils/homepageData';
import './Admin.css';

const SIDEBAR_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard' },
  { id: 'careers',      label: 'Job Openings' },
  { id: 'applications', label: 'CV Applications' },
  { id: 'announcement', label: 'Announcements' },
  { id: 'hero',         label: 'Hero Banner' },

  { id: 'expertise',    label: 'Expertise Cards' },
  { id: 'domains',      label: 'Domains / Sectors' },
  { id: 'stats',        label: 'Stats / Data' },
  { id: 'news',         label: 'News Section' },
  { id: 'aboutscroll',  label: 'About Section' },
  { id: 'cta',          label: 'CTA Section' },
  { id: 'faq',          label: 'FAQ Section' },
  { id: 'spotlight',    label: 'Subsidiary Spotlight' },
  { id: 'sectionorder', label: 'Section Ordering' },
  { id: 'settings',     label: 'Settings' },
];


function loadFromStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD  (Enhanced)
   ═══════════════════════════════════════════════════════════ */
function Dashboard() {
  const jobsCount = getStoredJobs().length;
  const appsCount = getStoredApplications().length;
  const faqCount = getFaq().length;
  const domainsCount = getDomains().length;

  const cards = [
    { label: 'Active Job Openings', value: String(jobsCount), accent: 'blue' },
    { label: 'CV Applications', value: String(appsCount), accent: 'blue' },
    { label: 'Total Subsidiaries', value: '26', accent: 'gold' },
    { label: 'Global Offices', value: '26', accent: 'gold' },
    { label: 'FAQ Items', value: String(faqCount), accent: 'blue' },
    { label: 'Active Sectors', value: String(domainsCount), accent: 'gold' },
  ];

  return (
    <div className="admin-dashboard">
      <h2 className="admin-section-title">Admin Dashboard</h2>
      <p className="admin-section-sub">Complete CMS for the Zebrold Group website — manage every section of the homepage from here.</p>
      <div className="admin-dash-cards">
        {cards.map(c => (
          <div key={c.label} className={`admin-dash-card admin-dash-card--${c.accent}`}>
            <span className="admin-dash-card-val">{c.value}</span>
            <span className="admin-dash-card-label">{c.label}</span>
          </div>
        ))}
      </div>
      <div className="admin-dash-quick-actions">
        <h3 className="admin-sub-title">Quick Actions</h3>
        <div className="admin-quick-grid">
          {[
            { label: 'Edit Hero Banner', target: 'hero' },
            { label: 'Edit Expertise Cards', target: 'expertise' },
            { label: 'Update Statistics', target: 'stats' },
            { label: 'Manage FAQ', target: 'faq' },
            { label: 'Reorder Sections', target: 'sectionorder' },
            { label: 'Manage Careers', target: 'careers' },
          ].map(action => (
            <button
              key={action.target}
              className="admin-quick-action-card"
              onClick={() => {
                /* Navigate by clicking sidebar programmatically */
                const btn = document.getElementById(`admin-nav-${action.target}`);
                if (btn) btn.click();
              }}
            >
              <span className="admin-quick-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="admin-dash-notice">
        <span>ℹ</span>
        <p>Full CMS active. Every homepage section can be edited from the sidebar. Changes persist via localStorage and appear immediately on the live site.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CAREERS MODULE  (unchanged from original)
   ═══════════════════════════════════════════════════════════ */
function CareersModule({ onSave }) {
  const [jobs, setJobs] = useState(getStoredJobs);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  const handleOpenCreate = () => {
    setCurrentJob({
      id: `job-${Date.now()}`,
      title: '',
      department: 'Engineering & CleanTech',
      location: 'Frankfurt, Germany',
      type: 'Full-Time',
      experience: '3+ Years',
      status: 'Active',
      description: '',
      roleSummary: '',
      keyResponsibilitiesText: '',
      requiredSkillsText: '',
      positionExpectationsText: '',
      requirementsText: '',
      postedDate: new Date().toISOString().split('T')[0]
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (job) => {
    setCurrentJob({
      ...job,
      requirementsText: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      keyResponsibilitiesText: Array.isArray(job.keyResponsibilities) ? job.keyResponsibilities.join('\n') : '',
      requiredSkillsText: Array.isArray(job.requiredSkills) ? job.requiredSkills.join('\n') : '',
      positionExpectationsText: Array.isArray(job.positionExpectations) ? job.positionExpectations.join('\n') : ''
    });
    setIsEditing(true);
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    if (!currentJob.title) {
      alert('Please fill in Job Title.');
      return;
    }

    const parseArray = (text) => (text || '').split('\n').map(r => r.trim()).filter(r => r.length > 0);

    const reqArray = parseArray(currentJob.requirementsText);
    const updatedJob = {
      ...currentJob,
      requirements: reqArray.length > 0 ? reqArray : ['Relevant industry experience required'],
      keyResponsibilities: parseArray(currentJob.keyResponsibilitiesText),
      requiredSkills: parseArray(currentJob.requiredSkillsText),
      positionExpectations: parseArray(currentJob.positionExpectationsText)
    };
    
    delete updatedJob.requirementsText;
    delete updatedJob.keyResponsibilitiesText;
    delete updatedJob.requiredSkillsText;
    delete updatedJob.positionExpectationsText;

    const existingIndex = jobs.findIndex(j => j.id === updatedJob.id);
    let newJobsList = [];
    if (existingIndex >= 0) {
      newJobsList = [...jobs];
      newJobsList[existingIndex] = updatedJob;
    } else {
      newJobsList = [updatedJob, ...jobs];
    }

    setJobs(newJobsList);
    saveJobs(newJobsList);
    setIsEditing(false);
    setCurrentJob(null);
    onSave('Job opening saved successfully.');
  };

  const handleDeleteJob = (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    const next = jobs.filter(j => j.id !== id);
    setJobs(next);
    saveJobs(next);
    onSave('Job position removed.');
  };

  const handleToggleStatus = (job) => {
    const nextStatus = job.status === 'Active' ? 'Closed' : 'Active';
    const next = jobs.map(j => j.id === job.id ? { ...j, status: nextStatus } : j);
    setJobs(next);
    saveJobs(next);
    onSave(`Job status changed to ${nextStatus}.`);
  };

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <h2 className="admin-section-title">Job Openings Management</h2>
          <p className="admin-section-sub">Create, edit, or toggle career listings for Zebrold Group.</p>
        </div>
        {!isEditing && (
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            + Add New Job Opening
          </button>
        )}
      </div>

      {isEditing && currentJob ? (
        <form onSubmit={handleSaveJob} className="admin-form admin-job-form">
          <h3 className="admin-sub-title">{currentJob.id.startsWith('job-1') ? 'Edit Position' : 'Create New Position'}</h3>
          
          <div className="form-group">
            <label htmlFor="job-title-input" className="form-label">Position Title *</label>
            <input
              id="job-title-input"
              type="text"
              required
              className="form-input"
              value={currentJob.title}
              onChange={e => setCurrentJob(p => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="job-dept-input" className="form-label">Department</label>
              <input
                id="job-dept-input"
                type="text"
                className="form-input"
                value={currentJob.department}
                onChange={e => setCurrentJob(p => ({ ...p, department: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="job-loc-input" className="form-label">Location</label>
              <input
                id="job-loc-input"
                type="text"
                className="form-input"
                value={currentJob.location}
                onChange={e => setCurrentJob(p => ({ ...p, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="job-type-select" className="form-label">Employment Type</label>
              <select
                id="job-type-select"
                className="form-select"
                value={currentJob.type}
                onChange={e => setCurrentJob(p => ({ ...p, type: e.target.value }))}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="job-exp-input" className="form-label">Experience Required</label>
              <input
                id="job-exp-input"
                type="text"
                className="form-input"
                value={currentJob.experience}
                onChange={e => setCurrentJob(p => ({ ...p, experience: e.target.value }))}
              />
            </div>
          </div>



          <div className="form-group">
            <label htmlFor="job-role-summary-input" className="form-label">Role Summary</label>
            <textarea
              id="job-role-summary-input"
              rows={3}
              className="form-textarea"
              value={currentJob.roleSummary || ''}
              onChange={e => setCurrentJob(p => ({ ...p, roleSummary: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="job-key-resp-input" className="form-label">Key Responsibilities (1 bullet per line)</label>
            <textarea
              id="job-key-resp-input"
              rows={4}
              className="form-textarea"
              value={currentJob.keyResponsibilitiesText || ''}
              onChange={e => setCurrentJob(p => ({ ...p, keyResponsibilitiesText: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="job-req-skills-input" className="form-label">Required Skills (1 bullet per line)</label>
            <textarea
              id="job-req-skills-input"
              rows={4}
              className="form-textarea"
              value={currentJob.requiredSkillsText || ''}
              onChange={e => setCurrentJob(p => ({ ...p, requiredSkillsText: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="job-pos-exp-input" className="form-label">Position Expectations (1 bullet per line)</label>
            <textarea
              id="job-pos-exp-input"
              rows={4}
              className="form-textarea"
              value={currentJob.positionExpectationsText || ''}
              onChange={e => setCurrentJob(p => ({ ...p, positionExpectationsText: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="job-req-input" className="form-label">Other Requirements (1 bullet per line)</label>
            <textarea
              id="job-req-input"
              rows={4}
              placeholder={"e.g. Master's degree in engineering\n5+ years experience"}
              className="form-textarea"
              value={currentJob.requirementsText || ''}
              onChange={e => setCurrentJob(p => ({ ...p, requirementsText: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={currentJob.status}
              onChange={e => setCurrentJob(p => ({ ...p, status: e.target.value }))}
            >
              <option value="Active">Active / Public</option>
              <option value="Closed">Closed / Internal</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Job Position
            </button>
          </div>
        </form>
      ) : (
        <div className="admin-job-list">
          {jobs.map(job => (
            <div key={job.id} className="admin-job-card">
              <div className="admin-job-card-header">
                <div>
                  <span className={`status-badge status-badge--${job.status.toLowerCase()}`}>{job.status}</span>
                  <h3 className="admin-job-title">{job.title}</h3>
                  <p className="admin-job-meta">{job.location} • {job.department} • {job.type}</p>
                </div>
                <div className="admin-job-card-actions">
                  <button className="btn-icon" onClick={() => handleToggleStatus(job)} title="Toggle Active Status">
                    {job.status === 'Active' ? '⏸ Pause' : '▶ Publish'}
                  </button>
                  <button className="btn-icon" onClick={() => handleOpenEdit(job)} title="Edit Position">
                    ✏ Edit
                  </button>
                  <button className="btn-icon btn-icon--danger" onClick={() => handleDeleteJob(job.id)} title="Delete Position">
                    🗑 Delete
                  </button>
                </div>
              </div>
              <p className="admin-job-desc">{job.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   APPLICATIONS MODULE  (unchanged from original)
   ═══════════════════════════════════════════════════════════ */
function ApplicationsModule({ onSave }) {
  const [apps, setApps] = useState(getStoredApplications);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  const filtered = apps.filter(a => {
    const matchSearch =
      a.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (appId, newStatus) => {
    const updated = apps.map(a => a.id === appId ? { ...a, status: newStatus } : a);
    setApps(updated);
    saveApplications(updated);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(p => ({ ...p, status: newStatus }));
    }
    onSave(`Application status updated to ${newStatus}.`);
  };

  const handleDeleteApp = (appId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    const updated = apps.filter(a => a.id !== appId);
    setApps(updated);
    saveApplications(updated);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(null);
    }
    onSave('Application deleted.');
  };

  const handleDownloadCV = (cvFile, candidateName) => {
    if (!cvFile || !cvFile.dataUrl) {
      alert('No attached CV file data found.');
      return;
    }
    const link = document.createElement('a');
    link.href = cvFile.dataUrl;
    link.download = cvFile.name || `CV_${candidateName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <h2 className="admin-section-title">CV & Candidate Applications</h2>
          <p className="admin-section-sub">Review job applications, view candidate profiles, and download submitted CV documents.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-apps-filter-bar">
        <input
          type="text"
          placeholder="Search by name, email or job title..."
          className="form-input admin-search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-select admin-status-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Under Review">Under Review</option>
          <option value="Interview">Interview</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      {filtered.length === 0 ? (
        <div className="admin-empty-box">
          <p>No candidate applications found matching your search criteria.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Applied Position</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>CV Document</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id}>
                  <td>
                    <div className="candidate-cell">
                      <strong className="candidate-name">{app.candidateName}</strong>
                      <span className="candidate-email">{app.email}</span>
                      <span className="candidate-phone">{app.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className="app-job-pill">{app.jobTitle}</span>
                  </td>
                  <td className="app-date-cell">
                    {new Date(app.appliedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <select
                      className={`status-select status-select--${(app.status || 'new').toLowerCase().replace(/\s+/g, '-')}`}
                      value={app.status || 'New'}
                      onChange={e => handleStatusChange(app.id, e.target.value)}
                    >
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Interview">Interview</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    {app.cvFile ? (
                      <button
                        className="btn-cv-download"
                        onClick={() => handleDownloadCV(app.cvFile, app.candidateName)}
                        title="Download CV"
                      >
                        📄 {app.cvFile.name || 'Download CV'}
                      </button>
                    ) : (
                      <span className="no-cv-text">No CV attached</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-table-action" onClick={() => setSelectedApp(app)}>
                        👁 View Details
                      </button>
                      <button className="btn-table-action btn-table-action--danger" onClick={() => handleDeleteApp(app.id)}>
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedApp && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedApp(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="app-modal-tag">APPLICATION PROFILE</span>
                <h3 className="admin-modal-title">{selectedApp.candidateName}</h3>
                <p className="admin-modal-sub">Applied for <strong>{selectedApp.jobTitle}</strong></p>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedApp(null)}>✕</button>
            </div>

            <div className="admin-modal-body">
              <div className="detail-grid">
                <div>
                  <label className="detail-label">Email</label>
                  <p className="detail-val">{selectedApp.email}</p>
                </div>
                <div>
                  <label className="detail-label">Phone</label>
                  <p className="detail-val">{selectedApp.phone}</p>
                </div>
                {selectedApp.linkedin && (
                  <div>
                    <label className="detail-label">LinkedIn / Portfolio</label>
                    <p className="detail-val">
                      <a href={selectedApp.linkedin} target="_blank" rel="noopener noreferrer" className="detail-link">
                        {selectedApp.linkedin} ↗
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <label className="detail-label">Submission Date</label>
                  <p className="detail-val">{new Date(selectedApp.appliedDate).toLocaleString()}</p>
                </div>
              </div>

              {selectedApp.coverNote && (
                <div className="detail-cover-box">
                  <label className="detail-label">Cover Note / Introduction</label>
                  <p className="detail-cover-text">{selectedApp.coverNote}</p>
                </div>
              )}

              {selectedApp.cvFile && (
                <div className="detail-cv-box">
                  <label className="detail-label">Uploaded CV Document</label>
                  <div className="cv-box-inner">
                    <div>
                      <strong className="cv-box-filename">{selectedApp.cvFile.name}</strong>
                      <span className="cv-box-filesize">{selectedApp.cvFile.size ? `${(selectedApp.cvFile.size / 1024).toFixed(1)} KB` : ''}</span>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDownloadCV(selectedApp.cvFile, selectedApp.candidateName)}
                    >
                      ⬇ Download / Open CV File
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANNOUNCEMENT MODULE  (unchanged from original)
   ═══════════════════════════════════════════════════════════ */
function AnnouncementModule({ onSave }) {
  const [form, setForm] = useState(() => loadFromStorage('zebrold_announcement', {
    text: 'Zebrold Group FY 2025–26 Annual Report now available — EUR 2.1B Revenue · 14% YoY Growth',
    color: 'blue',
    visible: true,
  }));

  const save = () => {
    localStorage.setItem('zebrold_announcement', JSON.stringify(form));
    onSave('Announcement saved successfully.');
  };

  return (
    <div className="admin-module">
      <h2 className="admin-section-title">Announcement Banner</h2>
      <p className="admin-section-sub">Edit the sitewide announcement shown at the top of all pages.</p>

      <div className="admin-form">
        <div className="form-group">
          <label htmlFor="ann-text" className="form-label">Banner Text</label>
          <textarea
            id="ann-text"
            className="form-textarea"
            rows={3}
            maxLength={300}
            value={form.text}
            onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
          />
          <span className="form-hint">{form.text.length}/300 characters</span>
        </div>

        <div className="form-group">
          <label className="form-label">Banner Colour</label>
          <div className="color-options" role="radiogroup" aria-label="Banner colour">
            {['blue', 'black', 'gold'].map(c => (
              <label key={c} className={`color-option color-option--${c} ${form.color === c ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="ann-color"
                  value={c}
                  checked={form.color === c}
                  onChange={() => setForm(p => ({ ...p, color: c }))}
                  className="sr-only"
                />
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Visibility</label>
          <div className="toggle-wrap">
            <button
              role="switch"
              aria-checked={form.visible}
              className={`toggle ${form.visible ? 'toggle--on' : ''}`}
              onClick={() => setForm(p => ({ ...p, visible: !p.visible }))}
              id="ann-visibility-toggle"
            >
              <span className="toggle-thumb" />
            </button>
            <span className="toggle-label">{form.visible ? 'Published' : 'Draft'}</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={save} id="ann-save-btn">Save Changes</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO BANNER MODULE  (unchanged from original)
   ═══════════════════════════════════════════════════════════ */
function HeroBannerModule({ onSave }) {
  const [form, setForm] = useState(() => loadFromStorage('zebrold_hero', {
    headline: 'Building Industries.\nDefining Futures.',
    subline: 'EUR 2.1 Billion · 26 Companies · 12 Sectors · Frankfurt, Germany',
    ctaLabel: 'Explore the Group →',
    ctaUrl: '/about',
    imagePreview: null,
  }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File too large. Max 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(p => ({ ...p, imagePreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(p => ({ ...p, imagePreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const save = () => {
    localStorage.setItem('zebrold_hero', JSON.stringify(form));
    onSave('Hero banner saved successfully.');
  };

  return (
    <div className="admin-module">
      <h2 className="admin-section-title">Hero Banner</h2>
      <p className="admin-section-sub">Edit the homepage hero headline, subline, and background image.</p>

      <div className="admin-form">
        <div className="form-group">
          <label htmlFor="hero-headline" className="form-label">Headline</label>
          <textarea
            id="hero-headline"
            className="form-textarea"
            rows={3}
            value={form.headline}
            onChange={e => setForm(p => ({ ...p, headline: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="hero-subline" className="form-label">Subline</label>
          <input
            id="hero-subline"
            type="text"
            className="form-input"
            value={form.subline}
            onChange={e => setForm(p => ({ ...p, subline: e.target.value }))}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hero-cta-label" className="form-label">CTA Button Label</label>
            <input
              id="hero-cta-label"
              type="text"
              className="form-input"
              value={form.ctaLabel}
              onChange={e => setForm(p => ({ ...p, ctaLabel: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="hero-cta-url" className="form-label">CTA Button URL</label>
            <input
              id="hero-cta-url"
              type="text"
              className="form-input"
              value={form.ctaUrl}
              onChange={e => setForm(p => ({ ...p, ctaUrl: e.target.value }))}
            />
          </div>
        </div>

        {/* Image upload */}
        <div className="form-group">
          <label className="form-label">Background Image</label>
          <div
            className="image-upload-zone"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => document.getElementById('hero-image-input').click()}
            role="button"
            tabIndex={0}
            aria-label="Upload hero background image"
            onKeyDown={e => e.key === 'Enter' && document.getElementById('hero-image-input').click()}
          >
            {form.imagePreview ? (
              <img src={form.imagePreview} alt="Hero preview" className="image-upload-preview" />
            ) : (
              <>
                <div className="image-upload-icon" aria-hidden="true">⬆</div>
                <p>Drag & drop or click to upload</p>
                <p className="image-upload-hint">JPG, PNG, WebP — max 5MB</p>
              </>
            )}
          </div>
          <input
            id="hero-image-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleImageUpload}
            aria-label="Select hero background image file"
          />
          {form.imagePreview && (
            <button
              className="btn-ghost"
              style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}
              onClick={() => setForm(p => ({ ...p, imagePreview: null }))}
            >
              Remove image
            </button>
          )}
        </div>

        <button className="btn btn-primary" onClick={save} id="hero-save-btn">Save Changes</button>
      </div>
    </div>
  );
}



/* ═══════════════════════════════════════════════════════════
   EXPERTISE CARDS MODULE  (NEW)
   ═══════════════════════════════════════════════════════════ */
function ExpertiseModule({ onSave }) {

  const [cards, setCards] = useState(getExpertise);
  const [activeCard, setActiveCard] = useState(0);

  const update = (idx, key, val) => {
    setCards(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: val };
      return next;
    });
  };

  const handleImageUpload = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File too large. Max 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => update(idx, 'imagePreview', ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveExpertise(cards);
    onSave('Expertise cards saved successfully.');
  };

  const handleReset = () => {
    if (!window.confirm('Reset all expertise cards to defaults?')) return;
    setCards([...EXPERTISE_DEFAULTS]);
    saveExpertise(EXPERTISE_DEFAULTS);
    onSave('Expertise cards reset to defaults.');
  };

  const card = cards[activeCard];

  return (
    <div className="admin-module admin-module--wide">
      <h2 className="admin-section-title">Expertise Cards</h2>
      <p className="admin-section-sub">Edit the 3 expertise showcase cards displayed on the homepage. Each card has German & English text.</p>

      {/* Card tabs */}
      <div className="admin-card-tabs">
        {cards.map((c, i) => (
          <button
            key={i}
            className={`admin-card-tab ${i === activeCard ? 'admin-card-tab--active' : ''}`}
            onClick={() => setActiveCard(i)}
          >
            <span className="admin-card-tab-num">{c.num}</span>
            <span className="admin-card-tab-label">{c.caption_de || c.caption_en}</span>
          </button>
        ))}
      </div>

      {card && (
        <div className="admin-form admin-card-editor">
          <div className="admin-lang-group">
            <div className="admin-lang-col">
              <h4 className="admin-lang-label">German</h4>
              <div className="form-group">
                <label className="form-label">Caption</label>
                <input className="form-input" value={card.caption_de || ''} onChange={e => update(activeCard, 'caption_de', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={card.title_de || ''} onChange={e => update(activeCard, 'title_de', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Body</label>
                <textarea className="form-textarea" rows={4} value={card.body_de || ''} onChange={e => update(activeCard, 'body_de', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">CTA Label</label>
                <input className="form-input" value={card.cta_de || ''} onChange={e => update(activeCard, 'cta_de', e.target.value)} />
              </div>
            </div>
            <div className="admin-lang-col">
              <h4 className="admin-lang-label">English</h4>
              <div className="form-group">
                <label className="form-label">Caption</label>
                <input className="form-input" value={card.caption_en || ''} onChange={e => update(activeCard, 'caption_en', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={card.title_en || ''} onChange={e => update(activeCard, 'title_en', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Body</label>
                <textarea className="form-textarea" rows={4} value={card.body_en || ''} onChange={e => update(activeCard, 'body_en', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">CTA Label</label>
                <input className="form-input" value={card.cta_en || ''} onChange={e => update(activeCard, 'cta_en', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">CTA Link URL</label>
              <input className="form-input" value={card.ctaPath || ''} onChange={e => update(activeCard, 'ctaPath', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Card Image</label>
              <div className="admin-mini-upload" onClick={() => document.getElementById(`exp-img-${activeCard}`).click()}>
                {card.imagePreview ? (
                  <img src={card.imagePreview} alt="Card preview" className="admin-mini-upload-img" />
                ) : (
                  <span className="admin-mini-upload-placeholder">⬆ Upload Image</span>
                )}
              </div>
              <input
                id={`exp-img-${activeCard}`}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={e => handleImageUpload(activeCard, e)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={handleReset}>Reset to Defaults</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save Expertise Cards</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DOMAINS / SECTORS MODULE  (NEW)
   ═══════════════════════════════════════════════════════════ */
function DomainsModule({ onSave }) {
  const [domains, setDomains] = useState(getDomains);
  const [editingIdx, setEditingIdx] = useState(null);

  const update = (idx, key, val) => {
    setDomains(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: val };
      return next;
    });
  };

  const handleSave = () => {
    saveDomains(domains);
    onSave('Domains saved successfully.');
  };

  const handleReset = () => {
    if (!window.confirm('Reset all domains to defaults?')) return;
    setDomains([...DOMAINS_DEFAULTS]);
    saveDomains(DOMAINS_DEFAULTS);
    onSave('Domains reset to defaults.');
  };

  return (
    <div className="admin-module admin-module--wide">
      <h2 className="admin-section-title">Domains / Sectors</h2>
      <p className="admin-section-sub">Edit the 12 domain items displayed in the sectors word list on the homepage.</p>

      <div className="admin-domains-list">
        {domains.map((d, i) => (
          <div key={d.id} className={`admin-domain-row ${editingIdx === i ? 'admin-domain-row--editing' : ''}`}>
            <div className="admin-domain-row-header" onClick={() => setEditingIdx(editingIdx === i ? null : i)}>
              <span className="admin-domain-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="admin-domain-name">{d.title}</span>
              <span className="admin-domain-sub">{d.subtitle}</span>
              <span className="admin-domain-chevron">{editingIdx === i ? '▾' : '›'}</span>
            </div>
            {editingIdx === i && (
              <div className="admin-domain-edit-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">German Title</label>
                    <input className="form-input" value={d.title} onChange={e => update(i, 'title', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">English Subtitle</label>
                    <input className="form-input" value={d.subtitle} onChange={e => update(i, 'subtitle', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Companies (comma-separated)</label>
                  <input className="form-input" value={d.companies} onChange={e => update(i, 'companies', e.target.value)} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions" style={{ marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-ghost" onClick={handleReset}>Reset to Defaults</button>
        <button type="button" className="btn btn-primary" onClick={handleSave}>Save Domains</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STATS / DATA MODULE  (NEW)
   ═══════════════════════════════════════════════════════════ */
function StatsModule({ onSave }) {
  const [stats, setStats] = useState(getStats);

  const update = (idx, key, val) => {
    setStats(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: val };
      return next;
    });
  };

  const handleSave = () => {
    saveStats(stats);
    onSave('Statistics saved successfully.');
  };

  const handleReset = () => {
    if (!window.confirm('Reset statistics to defaults?')) return;
    setStats([...STATS_DEFAULTS]);
    saveStats(STATS_DEFAULTS);
    onSave('Statistics reset to defaults.');
  };

  return (
    <div className="admin-module admin-module--wide">
      <h2 className="admin-section-title">Stats / Data Section</h2>
      <p className="admin-section-sub">Edit the 3 key statistics displayed on the homepage data section.</p>

      <div className="admin-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-preview">
              <span className="admin-stat-preview-value">
                {stat.prefix}{typeof stat.value === 'number' && stat.value % 1 !== 0 ? stat.value.toFixed(1) : stat.value}{stat.suffix}
              </span>
            </div>
            <div className="form-group">
              <label className="form-label">Value (number)</label>
              <input
                className="form-input"
                type="number"
                step="0.1"
                value={stat.value}
                onChange={e => update(i, 'value', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prefix</label>
                <input className="form-input" value={stat.prefix} onChange={e => update(i, 'prefix', e.target.value)} placeholder="e.g. €, +" />
              </div>
              <div className="form-group">
                <label className="form-label">Suffix</label>
                <input className="form-input" value={stat.suffix} onChange={e => update(i, 'suffix', e.target.value)} placeholder="e.g. %, Mrd." />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Label (DE)</label>
              <input className="form-input" value={stat.label_de || ''} onChange={e => update(i, 'label_de', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Label (EN)</label>
              <input className="form-input" value={stat.label_en || ''} onChange={e => update(i, 'label_en', e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions" style={{ marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-ghost" onClick={handleReset}>Reset to Defaults</button>
        <button type="button" className="btn btn-primary" onClick={handleSave}>Save Statistics</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NEWS SECTION MODULE  (ENHANCED — was placeholder)
   ═══════════════════════════════════════════════════════════ */
function NewsModule({ onSave }) {
  const [news, setNews] = useState(getNewsSection);
  const [activeTab, setActiveTab] = useState('featured');

  const updateSection = (section, key, val) => {
    setNews(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: val }
    }));
  };

  const handleImageUpload = (activeTab, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File too large. Max 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setNews(prev => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], imagePreview: ev.target.result }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveNewsSection(news);
    onSave('News section saved successfully.');
  };

  const handleReset = () => {
    if (!window.confirm('Reset news section to defaults?')) return;
    setNews({ ...NEWS_SECTION_DEFAULTS });
    saveNewsSection(NEWS_SECTION_DEFAULTS);
    onSave('News section reset to defaults.');
  };

  const tabs = [
    { id: 'featured', label: 'Featured Article', icon: '' },
    { id: 'facts', label: 'Facts Card', icon: '' },
    { id: 'facebook', label: 'Facebook Post', icon: '' },
    { id: 'instagram', label: 'Instagram Post', icon: '' },
  ];

  const section = news[activeTab];

  return (
    <div className="admin-module admin-module--wide">
      <h2 className="admin-section-title">News Section</h2>
      <p className="admin-section-sub">Edit the 4 news cards displayed in the "In the News" section on the homepage.</p>

      <div className="admin-card-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`admin-card-tab ${tab.id === activeTab ? 'admin-card-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="admin-card-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {section && (
        <div className="admin-form admin-card-editor">
          <div className="admin-lang-group">
            <div className="admin-lang-col">
              <h4 className="admin-lang-label">German</h4>
              {activeTab === 'featured' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Tag</label>
                    <input className="form-input" value={section.tag_de || ''} onChange={e => updateSection(activeTab, 'tag_de', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input className="form-input" value={section.title_de || ''} onChange={e => updateSection(activeTab, 'title_de', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" rows={3} value={section.desc_de || ''} onChange={e => updateSection(activeTab, 'desc_de', e.target.value)} />
                  </div>
                </>
              )}
              {activeTab === 'facts' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Tag</label>
                    <input className="form-input" value={section.tag_de || ''} onChange={e => updateSection(activeTab, 'tag_de', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input className="form-input" value={section.title_de || ''} onChange={e => updateSection(activeTab, 'title_de', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Body</label>
                    <textarea className="form-textarea" rows={3} value={section.body_de || ''} onChange={e => updateSection(activeTab, 'body_de', e.target.value)} />
                  </div>
                </>
              )}
              {(activeTab === 'facebook' || activeTab === 'instagram') && (
                <>
                  <div className="form-group">
                    <label className="form-label">Post Text</label>
                    <textarea className="form-textarea" rows={3} value={section.body_de || ''} onChange={e => updateSection(activeTab, 'body_de', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date Text</label>
                    <input className="form-input" value={section.date_de || ''} onChange={e => updateSection(activeTab, 'date_de', e.target.value)} />
                  </div>
                </>
              )}
            </div>
            <div className="admin-lang-col">
              <h4 className="admin-lang-label">English</h4>
              {activeTab === 'featured' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Tag</label>
                    <input className="form-input" value={section.tag_en || ''} onChange={e => updateSection(activeTab, 'tag_en', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input className="form-input" value={section.title_en || ''} onChange={e => updateSection(activeTab, 'title_en', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" rows={3} value={section.desc_en || ''} onChange={e => updateSection(activeTab, 'desc_en', e.target.value)} />
                  </div>
                </>
              )}
              {activeTab === 'facts' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Tag</label>
                    <input className="form-input" value={section.tag_en || ''} onChange={e => updateSection(activeTab, 'tag_en', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input className="form-input" value={section.title_en || ''} onChange={e => updateSection(activeTab, 'title_en', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Body</label>
                    <textarea className="form-textarea" rows={3} value={section.body_en || ''} onChange={e => updateSection(activeTab, 'body_en', e.target.value)} />
                  </div>
                </>
              )}
              {(activeTab === 'facebook' || activeTab === 'instagram') && (
                <>
                  <div className="form-group">
                    <label className="form-label">Post Text</label>
                    <textarea className="form-textarea" rows={3} value={section.body_en || ''} onChange={e => updateSection(activeTab, 'body_en', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date Text</label>
                    <input className="form-input" value={section.date_en || ''} onChange={e => updateSection(activeTab, 'date_en', e.target.value)} />
                  </div>
                </>
              )}
            </div>
          </div>

          {(activeTab === 'facebook' || activeTab === 'instagram') && (
            <div className="form-group">
              <label className="form-label">Hashtags</label>
              <input className="form-input" value={section.hashtags || ''} onChange={e => updateSection(activeTab, 'hashtags', e.target.value)} />
            </div>
          )}

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Card Image (Optional)</label>
            <div
              className="image-upload-zone"
              onDrop={e => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) handleImageUpload(activeTab, { target: { files: [e.dataTransfer.files[0]] } });
              }}
              onDragOver={e => e.preventDefault()}
              onClick={() => document.getElementById('news-image-input').click()}
              role="button"
              tabIndex={0}
            >
              {section.imagePreview ? (
                <img src={section.imagePreview} alt="Preview" className="image-upload-preview" style={{ height: 'auto', aspectRatio: '9/14' }} />
              ) : (
                <>
                  <div className="image-upload-icon" aria-hidden="true">⬆</div>
                  <p>Drag & drop or click to upload</p>
                  <p className="image-upload-hint">JPG, PNG, WebP — max 5MB (9:14 recommended)</p>
                </>
              )}
            </div>
            <input
              id="news-image-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={e => handleImageUpload(activeTab, e)}
            />
            {section.imagePreview && (
              <button
                className="btn-ghost"
                style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginTop: '0.5rem' }}
                onClick={() => updateSection(activeTab, 'imagePreview', null)}
              >
                Remove image
              </button>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={handleReset}>Reset to Defaults</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save News Section</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ABOUT SCROLL MODULE  (NEW)
   ═══════════════════════════════════════════════════════════ */
function AboutScrollModule({ onSave }) {
  const [form, setForm] = useState(getAboutScroll);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File too large. Max 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(p => ({ ...p, imagePreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveAboutScroll(form);
    onSave('About section saved successfully.');
  };

  const handleReset = () => {
    if (!window.confirm('Reset about section to defaults?')) return;
    setForm({ ...ABOUT_SCROLL_DEFAULTS });
    saveAboutScroll(ABOUT_SCROLL_DEFAULTS);
    onSave('About section reset to defaults.');
  };

  return (
    <div className="admin-module admin-module--wide">
      <h2 className="admin-section-title">About Section</h2>
      <p className="admin-section-sub">Edit the horizontal scrolling text and background image for the "About" section on the homepage.</p>

      <div className="admin-form">
        <div className="admin-lang-group">
          <div className="admin-lang-col">
            <h4 className="admin-lang-label">German</h4>
            <div className="form-group">
              <label className="form-label">Scrolling Text</label>
              <input className="form-input" value={form.text_de || ''} onChange={e => setForm(p => ({ ...p, text_de: e.target.value }))} />
            </div>
          </div>
          <div className="admin-lang-col">
            <h4 className="admin-lang-label">English</h4>
            <div className="form-group">
              <label className="form-label">Scrolling Text</label>
              <input className="form-input" value={form.text_en || ''} onChange={e => setForm(p => ({ ...p, text_en: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Background Image</label>
          <div
            className="image-upload-zone"
            onClick={() => document.getElementById('about-img-input').click()}
            role="button"
            tabIndex={0}
          >
            {form.imagePreview ? (
              <img src={form.imagePreview} alt="About preview" className="image-upload-preview" />
            ) : (
              <>
                <div className="image-upload-icon" aria-hidden="true">⬆</div>
                <p>Drag & drop or click to upload</p>
                <p className="image-upload-hint">JPG, PNG, WebP — max 5MB</p>
              </>
            )}
          </div>
          <input
            id="about-img-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleImageUpload}
          />
          {form.imagePreview && (
            <button
              className="btn-ghost"
              style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}
              onClick={() => setForm(p => ({ ...p, imagePreview: null }))}
            >
              Remove image
            </button>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={handleReset}>Reset to Defaults</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>Save About Section</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA SECTION MODULE  (NEW)
   ═══════════════════════════════════════════════════════════ */
function CtaModule({ onSave }) {
  const [form, setForm] = useState(getCta);

  const handleSave = () => {
    saveCta(form);
    onSave('CTA section saved successfully.');
  };

  const handleReset = () => {
    if (!window.confirm('Reset CTA section to defaults?')) return;
    setForm({ ...CTA_DEFAULTS });
    saveCta(CTA_DEFAULTS);
    onSave('CTA section reset to defaults.');
  };

  return (
    <div className="admin-module admin-module--wide">
      <h2 className="admin-section-title">CTA Section</h2>
      <p className="admin-section-sub">Edit the bottom call-to-action section on the homepage — headline, description, and button.</p>

      <div className="admin-form">
        <div className="admin-lang-group">
          <div className="admin-lang-col">
            <h4 className="admin-lang-label">German</h4>
            <div className="form-group">
              <label className="form-label">Caption</label>
              <input className="form-input" value={form.caption_de || ''} onChange={e => setForm(p => ({ ...p, caption_de: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Headline</label>
              <input className="form-input" value={form.h3_de || ''} onChange={e => setForm(p => ({ ...p, h3_de: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Big Text</label>
              <input className="form-input" value={form.bigText_de || ''} onChange={e => setForm(p => ({ ...p, bigText_de: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={3} value={form.desc_de || ''} onChange={e => setForm(p => ({ ...p, desc_de: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Button Label</label>
              <input className="form-input" value={form.btnLabel_de || ''} onChange={e => setForm(p => ({ ...p, btnLabel_de: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Fine Print</label>
              <input className="form-input" value={form.finePrint_de || ''} onChange={e => setForm(p => ({ ...p, finePrint_de: e.target.value }))} />
            </div>
          </div>
          <div className="admin-lang-col">
            <h4 className="admin-lang-label">English</h4>
            <div className="form-group">
              <label className="form-label">Caption</label>
              <input className="form-input" value={form.caption_en || ''} onChange={e => setForm(p => ({ ...p, caption_en: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Headline</label>
              <input className="form-input" value={form.h3_en || ''} onChange={e => setForm(p => ({ ...p, h3_en: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Big Text</label>
              <input className="form-input" value={form.bigText_en || ''} onChange={e => setForm(p => ({ ...p, bigText_en: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={3} value={form.desc_en || ''} onChange={e => setForm(p => ({ ...p, desc_en: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Button Label</label>
              <input className="form-input" value={form.btnLabel_en || ''} onChange={e => setForm(p => ({ ...p, btnLabel_en: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Fine Print</label>
              <input className="form-input" value={form.finePrint_en || ''} onChange={e => setForm(p => ({ ...p, finePrint_en: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Button URL</label>
          <input className="form-input" value={form.btnUrl || ''} onChange={e => setForm(p => ({ ...p, btnUrl: e.target.value }))} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={handleReset}>Reset to Defaults</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>Save CTA Section</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FAQ MODULE  (NEW — Full CRUD)
   ═══════════════════════════════════════════════════════════ */
function FaqModule({ onSave }) {
  const [faqs, setFaqs] = useState(getFaq);
  const [editingIdx, setEditingIdx] = useState(null);

  const update = (idx, key, val) => {
    setFaqs(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: val };
      return next;
    });
  };

  const addFaq = () => {
    const newItem = { q_de: '', q_en: '', a_de: '', a_en: '' };
    setFaqs(prev => [...prev, newItem]);
    setEditingIdx(faqs.length);
  };

  const removeFaq = (idx) => {
    if (!window.confirm('Delete this FAQ item?')) return;
    setFaqs(prev => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) setEditingIdx(null);
    else if (editingIdx > idx) setEditingIdx(editingIdx - 1);
  };

  const moveFaq = (idx, direction) => {
    const target = idx + direction;
    if (target < 0 || target >= faqs.length) return;
    setFaqs(prev => {
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
    if (editingIdx === idx) setEditingIdx(target);
    else if (editingIdx === target) setEditingIdx(idx);
  };

  const handleSave = () => {
    saveFaq(faqs);
    onSave('FAQ saved successfully.');
  };

  const handleReset = () => {
    if (!window.confirm('Reset all FAQ items to defaults?')) return;
    setFaqs([...FAQ_DEFAULTS]);
    saveFaq(FAQ_DEFAULTS);
    setEditingIdx(null);
    onSave('FAQ reset to defaults.');
  };

  return (
    <div className="admin-module admin-module--wide">
      <div className="admin-module-header">
        <div>
          <h2 className="admin-section-title">FAQ Section</h2>
          <p className="admin-section-sub">Add, edit, delete, and reorder FAQ items. Each item has German & English Q&A pairs.</p>
        </div>
        <button className="btn btn-primary" onClick={addFaq}>+ Add FAQ Item</button>
      </div>

      <div className="admin-faq-list">
        {faqs.map((faq, i) => (
          <div key={i} className={`admin-faq-item ${editingIdx === i ? 'admin-faq-item--editing' : ''}`}>
            <div className="admin-faq-item-header">
              <div className="admin-faq-reorder">
                <button className="admin-faq-move-btn" onClick={() => moveFaq(i, -1)} disabled={i === 0} title="Move up">▲</button>
                <button className="admin-faq-move-btn" onClick={() => moveFaq(i, 1)} disabled={i === faqs.length - 1} title="Move down">▼</button>
              </div>
              <span className="admin-faq-num">Q{i + 1}</span>
              <span className="admin-faq-preview" onClick={() => setEditingIdx(editingIdx === i ? null : i)}>
                {faq.q_de || faq.q_en || '(Empty question)'}
              </span>
              <div className="admin-faq-item-actions">
                <button className="btn-icon" onClick={() => setEditingIdx(editingIdx === i ? null : i)}>
                  {editingIdx === i ? '▾ Close' : '✏ Edit'}
                </button>
                <button className="btn-icon btn-icon--danger" onClick={() => removeFaq(i)}>🗑</button>
              </div>
            </div>

            {editingIdx === i && (
              <div className="admin-faq-edit-body">
                <div className="admin-lang-group">
                  <div className="admin-lang-col">
                    <h4 className="admin-lang-label">German</h4>
                    <div className="form-group">
                      <label className="form-label">Question</label>
                      <input className="form-input" value={faq.q_de || ''} onChange={e => update(i, 'q_de', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Answer</label>
                      <textarea className="form-textarea" rows={4} value={faq.a_de || ''} onChange={e => update(i, 'a_de', e.target.value)} />
                    </div>
                  </div>
                  <div className="admin-lang-col">
                    <h4 className="admin-lang-label">English</h4>
                    <div className="form-group">
                      <label className="form-label">Question</label>
                      <input className="form-input" value={faq.q_en || ''} onChange={e => update(i, 'q_en', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Answer</label>
                      <textarea className="form-textarea" rows={4} value={faq.a_en || ''} onChange={e => update(i, 'a_en', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions" style={{ marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-ghost" onClick={handleReset}>Reset to Defaults</button>
        <button type="button" className="btn btn-primary" onClick={handleSave}>Save FAQ</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SPOTLIGHT MODULE  (unchanged from original)
   ═══════════════════════════════════════════════════════════ */
function SpotlightModule({ onSave }) {
  const [slots, setSlots] = useState(() =>
    loadFromStorage('zebrold_spotlight', [
      subsidiaries[0].name,
      subsidiaries[4].name,
      subsidiaries[11].name,
      subsidiaries[13].name,
    ])
  );

  const save = () => {
    localStorage.setItem('zebrold_spotlight', JSON.stringify(slots));
    onSave('Subsidiary spotlight saved.');
  };

  return (
    <div className="admin-module">
      <h2 className="admin-section-title">Subsidiary Spotlight</h2>
      <p className="admin-section-sub">Choose which 4 subsidiaries appear in the homepage carousel.</p>

      <div className="admin-form">
        {slots.map((slot, i) => (
          <div key={i} className="form-group">
            <label htmlFor={`slot-${i}`} className="form-label">Slot {i + 1}</label>
            <select
              id={`slot-${i}`}
              className="form-select"
              value={slot}
              onChange={e => {
                const next = [...slots];
                next[i] = e.target.value;
                setSlots(next);
              }}
            >
              {subsidiaries.map(co => (
                <option key={co.id} value={co.name}>{co.name}</option>
              ))}
            </select>
          </div>
        ))}
        <button className="btn btn-primary" onClick={save} id="spotlight-save-btn">Save Layout</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION ORDERING MODULE  (NEW)
   ═══════════════════════════════════════════════════════════ */
function SectionOrderModule({ onSave }) {
  const [sections, setSections] = useState(getSectionOrder);

  const toggleVisibility = (idx) => {
    setSections(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], visible: !next[idx].visible };
      return next;
    });
  };

  const moveSection = (idx, direction) => {
    const target = idx + direction;
    if (target < 0 || target >= sections.length) return;
    setSections(prev => {
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const handleSave = () => {
    saveSectionOrder(sections);
    onSave('Section order saved successfully.');
  };

  const handleReset = () => {
    if (!window.confirm('Reset section order to defaults?')) return;
    setSections([...SECTION_ORDER_DEFAULTS]);
    saveSectionOrder(SECTION_ORDER_DEFAULTS);
    onSave('Section order reset to defaults.');
  };

  return (
    <div className="admin-module admin-module--wide">
      <h2 className="admin-section-title">Section Ordering</h2>
      <p className="admin-section-sub">Reorder homepage sections and toggle their visibility. Changes affect the homepage layout.</p>

      <div className="admin-section-order-list">
        {sections.map((sec, i) => (
          <div key={sec.id} className={`admin-section-order-item ${!sec.visible ? 'admin-section-order-item--hidden' : ''}`}>
            <div className="admin-section-order-left">
              <div className="admin-section-order-arrows">
                <button
                  className="admin-order-arrow-btn"
                  onClick={() => moveSection(i, -1)}
                  disabled={i === 0}
                  title="Move up"
                >▲</button>
                <button
                  className="admin-order-arrow-btn"
                  onClick={() => moveSection(i, 1)}
                  disabled={i === sections.length - 1}
                  title="Move down"
                >▼</button>
              </div>
              <span className="admin-section-order-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="admin-section-order-label">{sec.label}</span>
            </div>
            <div className="admin-section-order-right">
              <span className={`admin-section-order-badge ${sec.visible ? 'admin-section-order-badge--visible' : 'admin-section-order-badge--hidden'}`}>
                {sec.visible ? 'Visible' : 'Hidden'}
              </span>
              <button
                role="switch"
                aria-checked={sec.visible}
                className={`toggle toggle--small ${sec.visible ? 'toggle--on' : ''}`}
                onClick={() => toggleVisibility(i)}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions" style={{ marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-ghost" onClick={handleReset}>Reset to Defaults</button>
        <button type="button" className="btn btn-primary" onClick={handleSave}>Save Section Order</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS MODULE  (unchanged from original)
   ═══════════════════════════════════════════════════════════ */
function SettingsModule({ onSave }) {
  const [form, setForm] = useState(() => loadFromStorage('zebrold_settings', {
    tagline: 'Building Industries. Defining Futures.',
    phone: '+49 69 2100 4800',
    email: 'investor@zebroldgroup.com',
    linkedin: 'https://linkedin.com/company/zebrold',
  }));

  const save = () => {
    localStorage.setItem('zebrold_settings', JSON.stringify(form));
    onSave('Settings saved.');
  };

  return (
    <div className="admin-module">
      <h2 className="admin-section-title">Site Settings</h2>
      <p className="admin-section-sub">Global site configuration — tagline, contact details, and social links.</p>

      <div className="admin-form">
        {[
          { id: 'settings-tagline', key: 'tagline', label: 'Site Tagline', type: 'text' },
          { id: 'settings-phone', key: 'phone', label: 'HQ Phone Number', type: 'tel' },
          { id: 'settings-email', key: 'email', label: 'HQ Email Address', type: 'email' },
          { id: 'settings-linkedin', key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
        ].map(field => (
          <div key={field.key} className="form-group">
            <label htmlFor={field.id} className="form-label">{field.label}</label>
            <input
              id={field.id}
              type={field.type}
              className="form-input"
              value={form[field.key]}
              onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
            />
          </div>
        ))}
        <button className="btn btn-primary" onClick={save} id="settings-save-btn">Save Settings</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN (main)
   ═══════════════════════════════════════════════════════════ */
export default function Admin() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = useCallback((msg) => {
    setToast({ message: msg, type: 'success' });
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'careers': return <CareersModule onSave={showToast} />;
      case 'applications': return <ApplicationsModule onSave={showToast} />;
      case 'announcement': return <AnnouncementModule onSave={showToast} />;
      case 'hero': return <HeroBannerModule onSave={showToast} />;

      case 'expertise': return <ExpertiseModule onSave={showToast} />;
      case 'domains': return <DomainsModule onSave={showToast} />;
      case 'stats': return <StatsModule onSave={showToast} />;
      case 'news': return <NewsModule onSave={showToast} />;
      case 'aboutscroll': return <AboutScrollModule onSave={showToast} />;
      case 'cta': return <CtaModule onSave={showToast} />;
      case 'faq': return <FaqModule onSave={showToast} />;
      case 'spotlight': return <SpotlightModule onSave={showToast} />;
      case 'sectionorder': return <SectionOrderModule onSave={showToast} />;
      case 'settings': return <SettingsModule onSave={showToast} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Mobile sidebar toggle */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`} aria-label="Admin navigation">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <img src={zebroldLogoMark} alt="Zebrold Group Logo" className="admin-logo-img" />
            <div className="admin-logo-text-wrap">
              <span className="admin-logo-word">ZEBROLD</span>
              <span className="admin-logo-sub">ADMIN CONSOLE</span>
            </div>
          </div>
        </div>
        <nav>
          <ul className="admin-nav" role="list">
            {SIDEBAR_ITEMS.map(item => (
              <li key={item.id}>
                <button
                  className={`admin-nav-item ${activeModule === item.id ? 'admin-nav-item--active' : ''}`}
                  onClick={() => {
                    setActiveModule(item.id);
                    setSidebarOpen(false);
                  }}
                  aria-current={activeModule === item.id ? 'page' : undefined}
                  id={`admin-nav-${item.id}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" className="admin-view-site">← View Site</a>
          <p className="admin-sidebar-note">Frontend CMS — persistent localStorage</p>
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="admin-main" id="admin-main-content">
        <div className="admin-topbar">
          <h1 className="admin-topbar-title">
            {SIDEBAR_ITEMS.find(i => i.id === activeModule)?.label || 'Dashboard'}
          </h1>
          <div className="admin-topbar-right">
            <a href="/" className="admin-topbar-site-link" target="_blank" rel="noopener noreferrer">
              View Live Site ↗
            </a>
            <span className="admin-topbar-user">Administrator</span>
          </div>
        </div>

        <div className="admin-content">
          {renderModule()}
        </div>
      </main>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
