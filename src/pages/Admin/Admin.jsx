import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Toast from '../../components/Toast/Toast';
import { subsidiaries } from '../../data/subsidiaries';
import zebroldLogoMark from '../../assets/zebrold_logo_mark.png';
import { getStoredJobs, saveJobs, getStoredApplications, saveApplications } from '../../data/careersData';
import {
  MAILBOX_CONFIG,
  generateNoReplyEmailHtml,
  generateTalentEmailHtml,
  generateInfoEmailHtml,
  sendNoReplyEmail,
  sendTalentEmail,
  sendInfoEmail,
  sendCustomAdminEmail,
  getSentEmailLogs,
  clearSentEmailLogs,
  sendCandidateStatusEmail,
  generateCandidateStatusEmailHtml
} from '../../services/emailService';
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
import {
  getAdminAccounts,
  getActiveSession,
  validateAdminLogin,
  requestPasswordResetCode,
  updatePasswordWithResetCode,
  logoutAdminSession,
  changeAdminPassword
} from '../../utils/adminAuth';
import './Admin.css';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'mailcenter', label: 'Mail Center' },
  { id: 'careers', label: 'Job Openings' },
  { id: 'applications', label: 'CV Applications' },
  { id: 'announcement', label: 'Announcements' },
  { id: 'hero', label: 'Hero Banner' },

  { id: 'expertise', label: 'Expertise Cards' },
  { id: 'domains', label: 'Domains / Sectors' },
  { id: 'stats', label: 'Stats / Data' },
  { id: 'news', label: 'News Section' },
  { id: 'aboutscroll', label: 'About Section' },
  { id: 'cta', label: 'CTA Section' },
  { id: 'faq', label: 'FAQ Section' },
  { id: 'spotlight', label: 'Subsidiary Spotlight' },
  { id: 'sectionorder', label: 'Section Ordering' },
  { id: 'security', label: 'Security & Logins' },
  { id: 'settings', label: 'Settings' },
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
  const sentMailCount = getSentEmailLogs().length;

  const cards = [
    { label: 'Active Job Openings', value: String(jobsCount), accent: 'blue' },
    { label: 'CV Applications', value: String(appsCount), accent: 'blue' },
    { label: 'Sent Dispatches Logged', value: String(sentMailCount), accent: 'gold' },
    { label: 'Active Mailboxes', value: '3 (zebrold.de)', accent: 'gold' },
    { label: 'Total Subsidiaries', value: '26', accent: 'gold' },
    { label: 'Global Offices', value: '26', accent: 'gold' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dash-header-bar">
        <div>
          <h2 className="admin-section-title">Admin Dashboard</h2>
          <p className="admin-section-sub">Complete CMS & Communications Center for Zebrold Group (zebrold.de) — manage content, careers, and emails in real-time.</p>
        </div>
      </div>
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
            { label: '✉️ Open Mail Center', target: 'mailcenter' },
            { label: '👥 Review Applications', target: 'applications' },
            { label: '💼 Manage Job Openings', target: 'careers' },
            { label: '✨ Edit Hero Banner', target: 'hero' },
            { label: '📊 Update Statistics', target: 'stats' },
            { label: '🔐 Security & Logins', target: 'security' },
          ].map(action => (
            <button
              key={action.target}
              className="admin-quick-action-card"
              onClick={() => {
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
        <p>Mailboxes active: <code>no-reply@zebrold.de</code>, <code>talent.acquisition@zebrold.de</code>, and <code>info@zebrold.de</code>. Full real-time HTML email dispatching and simulation available in the Mail Center.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIL CENTER & DISPATCHER MODULE (no-reply@zebrold.de, talent.acquisition@zebrold.de, info@zebrold.de)
   ═══════════════════════════════════════════════════════════ */
function MailCenterModule({ onSave, session }) {
  const [activeMailbox, setActiveMailbox] = useState('no-reply@zebrold.de');
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile' | 'code'
  const [isSending, setIsSending] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [sentLogs, setSentLogs] = useState(getSentEmailLogs);
  const [viewModalLog, setViewModalLog] = useState(null);
  const [logSearch, setLogSearch] = useState('');

  // 1. no-reply@zebrold.de form state
  const [noReplyForm, setNoReplyForm] = useState({
    toName: 'Operations Manager',
    toEmail: 'admin@zebrold.de',
    title: 'Admin Password Reset Security Verification',
    otpCode: '584920',
    referenceId: 'SEC-OTP-98214',
    alertType: 'PASSWORD RESET OTP',
    message: 'A security verification request was initiated for your Zebrold Group Admin account. Enter the 6-digit verification code below to authorize the password change.',
    expiresIn: '15 minutes',
    actionUrl: '',
    actionText: 'Open Security Console'
  });

  // 2. talent.acquisition@zebrold.de form state
  const [talentForm, setTalentForm] = useState({
    candidateName: 'Alex Morgan',
    candidateEmail: 'alex.morgan@example.com',
    jobTitle: 'Senior Full-Stack Software Engineer',
    department: 'Engineering & Technology',
    location: 'Frankfurt am Main / Hybrid',
    status: 'INTERVIEW',
    customMessage: 'We were highly impressed by your experience and portfolio. Our hiring committee would like to invite you for a 45-minute technical and architecture discussion with our engineering leads.',
    hasInterviewDetails: true,
    interviewDate: 'Thursday, August 14, 2026',
    interviewTime: '14:30',
    interviewTimezone: 'CET (Frankfurt)',
    interviewFormat: 'Video Conference (Google Meet)',
    interviewer: 'Dr. Marcus Vance (VP Engineering) & Sarah Lin (Lead Architect)',
    interviewLink: 'https://meet.google.com/zbr-tech-eval',
    hasOfferDetails: false,
    offerRole: 'Senior Full-Stack Software Engineer',
    offerStartDate: 'October 1, 2026',
    offerDeadline: 'August 25, 2026',
    actionUrl: 'https://meet.google.com/zbr-tech-eval',
    actionText: 'Confirm Interview Slot'
  });

  // 3. info@zebrold.de form state
  const [infoForm, setInfoForm] = useState({
    recipientName: 'Herr Dietrich Weber',
    recipientEmail: 'partner@meridian-capital.de',
    company: 'Meridian Capital Partners',
    subject: 'Response to Institutional Partnership Inquiry — Zebrold Group',
    memoRef: 'ZBR-INQ-2026-4402',
    department: 'Corporate Relations & Strategic Partnerships',
    messageBody: 'Thank you for your correspondence regarding prospective strategic co-investment and syndicate opportunities with Zebrold Group. Our Executive Committee has reviewed your memorandum and welcomes the opportunity for an introductory executive discussion.',
    highlightBox: 'An executive liaison from our Frankfurt Global HQ will coordinate the preliminary agenda and digital briefing room.',
    signatoryName: 'Executive Secretariat',
    signatoryTitle: 'Zebrold Group Corporate Relations',
    actionUrl: 'https://www.zebrold.de',
    actionText: 'Visit Executive Portal'
  });

  // Presets catalogue
  const PRESETS = {
    'no-reply@zebrold.de': [
      {
        id: 'otp',
        name: '🔑 Security Reset OTP',
        apply: () => {
          setNoReplyForm(p => ({
            ...p,
            title: 'Admin Password Reset Security Verification',
            otpCode: String(Math.floor(100000 + Math.random() * 900000)),
            alertType: 'PASSWORD RESET OTP',
            referenceId: `SEC-OTP-${Math.floor(10000 + Math.random() * 90000)}`,
            message: 'A security verification request was initiated for your Zebrold Group Admin account. Enter the 6-digit verification code below to authorize the password change.',
            expiresIn: '15 minutes',
            actionUrl: '',
            actionText: 'Open Security Console'
          }));
        }
      },
      {
        id: 'maintenance',
        name: '⚡ System Maintenance',
        apply: () => {
          setNoReplyForm(p => ({
            ...p,
            title: 'Scheduled Infrastructure Maintenance Notice',
            otpCode: '',
            alertType: 'SYSTEM UPGRADE',
            referenceId: `MAINT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
            message: 'Please be advised that scheduled maintenance will occur on the Zebrold Central Infrastructure this Saturday from 02:00 to 02:30 UTC. Systems will resume normal operations immediately afterward.',
            expiresIn: 'Notice Period: 48h',
            actionUrl: 'https://www.zebrold.de',
            actionText: 'Check System Status'
          }));
        }
      },
      {
        id: 'receipt',
        name: '🧾 Transaction Receipt',
        apply: () => {
          setNoReplyForm(p => ({
            ...p,
            title: 'Portal Submission & Transaction Receipt',
            otpCode: '',
            alertType: 'TRANSACTION RECEIPT',
            referenceId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
            message: 'We have received your electronic filing and transaction payload. The submission has been cryptographically signed and queued for automated processing.',
            expiresIn: '',
            actionUrl: 'https://www.zebrold.de',
            actionText: 'View Submission Portal'
          }));
        }
      }
    ],
    'talent.acquisition@zebrold.de': [
      {
        id: 'interview',
        name: '📅 Interview Invitation',
        apply: () => {
          setTalentForm(p => ({
            ...p,
            status: 'INTERVIEW',
            hasInterviewDetails: true,
            hasOfferDetails: false,
            customMessage: 'We were highly impressed by your qualifications and would like to invite you for an interview with our technical leadership panel.',
            interviewDate: 'Thursday, August 14, 2026',
            interviewTime: '14:30',
            interviewTimezone: 'CET (Frankfurt)',
            interviewFormat: 'Video Conference (Google Meet)',
            interviewer: 'Dr. Marcus Vance (VP Engineering) & Sarah Lin (Lead Architect)',
            interviewLink: 'https://meet.google.com/zbr-tech-eval',
            actionUrl: 'https://meet.google.com/zbr-tech-eval',
            actionText: 'Confirm Interview Slot'
          }));
        }
      },
      {
        id: 'offer',
        name: '🎉 Formal Job Offer',
        apply: () => {
          setTalentForm(p => ({
            ...p,
            status: 'HIRED',
            hasInterviewDetails: false,
            hasOfferDetails: true,
            customMessage: 'We are delighted to extend a formal offer of employment to join Zebrold Group. The executive hiring board was deeply impressed by your analytical vision and background.',
            offerRole: p.jobTitle || 'Senior Full-Stack Software Engineer',
            offerStartDate: 'October 1, 2026',
            offerDeadline: 'August 25, 2026',
            actionUrl: 'https://www.zebrold.de/careers',
            actionText: 'Review & Sign Offer Packet'
          }));
        }
      },
      {
        id: 'received',
        name: '📥 Application Received',
        apply: () => {
          setTalentForm(p => ({
            ...p,
            status: 'APPLICATION RECEIVED',
            hasInterviewDetails: false,
            hasOfferDetails: false,
            customMessage: 'Thank you for submitting your application to Zebrold Group. We have safely received your CV and portfolio. Our talent team is actively evaluating your profile.',
            actionUrl: 'https://www.zebrold.de/careers',
            actionText: 'View Careers Portal'
          }));
        }
      },
      {
        id: 'rejected',
        name: '🤝 Outcome Notice',
        apply: () => {
          setTalentForm(p => ({
            ...p,
            status: 'REJECTED',
            hasInterviewDetails: false,
            hasOfferDetails: false,
            customMessage: 'Thank you for participating in our recruitment process. While your background is impressive, we have chosen to proceed with another candidate whose background aligns more closely with our immediate requirements.',
            actionUrl: 'https://www.zebrold.de/careers',
            actionText: 'Browse Open Opportunities'
          }));
        }
      }
    ],
    'info@zebrold.de': [
      {
        id: 'inquiry',
        name: '💬 Official Inquiry Reply',
        apply: () => {
          setInfoForm(p => ({
            ...p,
            subject: 'Response to Institutional Partnership Inquiry — Zebrold Group',
            memoRef: `ZBR-INQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            department: 'Corporate Relations & Strategic Partnerships',
            messageBody: 'Thank you for your correspondence regarding prospective strategic partnership opportunities with Zebrold Group. Our Executive Committee has reviewed your memorandum and welcomes the opportunity for an introductory discussion.',
            highlightBox: 'An executive liaison from our Frankfurt Global HQ will coordinate the preliminary agenda and digital briefing room.',
            signatoryName: 'Executive Secretariat',
            signatoryTitle: 'Zebrold Group Corporate Relations',
            actionUrl: 'https://www.zebrold.de',
            actionText: 'Visit Executive Portal'
          }));
        }
      },
      {
        id: 'announcement',
        name: '📢 Corporate Announcement',
        apply: () => {
          setInfoForm(p => ({
            ...p,
            subject: 'Corporate Communiqué: Expansion of Frankfurt Global Technology Center',
            memoRef: `ZBR-PR-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
            department: 'Office of the Chief Executive',
            messageBody: 'Zebrold International Holdings Limited is pleased to announce the formal expansion of our European Technology & Quantitative Center in Frankfurt am Main, reinforcing our cross-border operational footprint across EMEA, APAC, and North America.',
            highlightBox: 'Strategic focus includes deep-tech infrastructure, green-energy enterprise platforms, and institutional liquidity hubs.',
            signatoryName: 'Office of the Executive Board',
            signatoryTitle: 'Zebrold International Holdings Limited',
            actionUrl: 'https://www.zebrold.de',
            actionText: 'Read Full Press Release'
          }));
        }
      }
    ]
  };

  // Real-time generated HTML based on active mailbox & form
  const renderedHtml = useMemo(() => {
    if (activeMailbox === 'no-reply@zebrold.de') {
      return generateNoReplyEmailHtml({
        recipientName: noReplyForm.toName,
        recipientEmail: noReplyForm.toEmail,
        title: noReplyForm.title,
        otpCode: noReplyForm.otpCode,
        referenceId: noReplyForm.referenceId,
        alertType: noReplyForm.alertType,
        message: noReplyForm.message,
        actionUrl: noReplyForm.actionUrl,
        actionText: noReplyForm.actionText,
        expiresIn: noReplyForm.expiresIn,
      });
    } else if (activeMailbox === 'talent.acquisition@zebrold.de') {
      return generateTalentEmailHtml({
        candidateName: talentForm.candidateName,
        candidateEmail: talentForm.candidateEmail,
        jobTitle: talentForm.jobTitle,
        department: talentForm.department,
        location: talentForm.location,
        status: talentForm.status,
        customMessage: talentForm.customMessage,
        interviewDetails: talentForm.hasInterviewDetails ? {
          date: talentForm.interviewDate,
          time: talentForm.interviewTime,
          timezone: talentForm.interviewTimezone,
          format: talentForm.interviewFormat,
          interviewer: talentForm.interviewer,
          link: talentForm.interviewLink,
        } : null,
        offerDetails: talentForm.hasOfferDetails ? {
          role: talentForm.offerRole,
          startDate: talentForm.offerStartDate,
          deadline: talentForm.offerDeadline,
        } : null,
        actionUrl: talentForm.actionUrl,
        actionText: talentForm.actionText,
      });
    } else {
      return generateInfoEmailHtml({
        recipientName: infoForm.recipientName,
        recipientEmail: infoForm.recipientEmail,
        company: infoForm.company,
        subject: infoForm.subject,
        memoRef: infoForm.memoRef,
        department: infoForm.department,
        messageBody: infoForm.messageBody,
        highlightBox: infoForm.highlightBox,
        actionUrl: infoForm.actionUrl,
        actionText: infoForm.actionText,
        signatoryName: infoForm.signatoryName,
        signatoryTitle: infoForm.signatoryTitle,
      });
    }
  }, [activeMailbox, noReplyForm, talentForm, infoForm]);

  // Dispatch Handlers
  const handleSendEmail = async (isTest = false) => {
    setIsSending(true);
    let targetEmail = '';
    let targetName = '';
    let emailSubject = '';

    if (activeMailbox === 'no-reply@zebrold.de') {
      targetEmail = isTest ? (session?.email || 'admin@zebrold.de') : noReplyForm.toEmail;
      targetName = isTest ? 'Admin Test' : noReplyForm.toName;
      emailSubject = isTest ? `[TEST DISPATCH] ${noReplyForm.title}` : noReplyForm.title;
    } else if (activeMailbox === 'talent.acquisition@zebrold.de') {
      targetEmail = isTest ? (session?.email || 'admin@zebrold.de') : talentForm.candidateEmail;
      targetName = isTest ? 'Candidate Test' : talentForm.candidateName;
      emailSubject = isTest ? `[TEST DISPATCH] Application Update: ${talentForm.jobTitle}` : `Application Update: ${talentForm.jobTitle} (${talentForm.status})`;
    } else {
      targetEmail = isTest ? (session?.email || 'admin@zebrold.de') : infoForm.recipientEmail;
      targetName = isTest ? 'Corporate Test' : infoForm.recipientName;
      emailSubject = isTest ? `[TEST DISPATCH] ${infoForm.subject}` : infoForm.subject;
    }

    if (!targetEmail || !targetEmail.includes('@')) {
      alert('Please provide a valid recipient email address.');
      setIsSending(false);
      return;
    }

    const res = await sendCustomAdminEmail({
      fromMailbox: activeMailbox,
      toEmail: targetEmail,
      toName: targetName,
      subject: emailSubject,
      htmlContent: renderedHtml,
    });

    setIsSending(false);
    setSentLogs(getSentEmailLogs());
    onSave(`Dispatched from ${activeMailbox} to ${targetEmail} via ${res.provider}.`);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(renderedHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
    onSave('Full HTML email template copied to clipboard!');
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([renderedHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const prefix = activeMailbox.split('@')[0];
    link.download = `zebrold-${prefix}-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onSave('HTML template file downloaded.');
  };

  const handleClearLogs = () => {
    if (!window.confirm('Are you sure you want to clear the sent email logs?')) return;
    clearSentEmailLogs();
    setSentLogs([]);
    onSave('Sent email logs cleared.');
  };

  const currentMailboxMeta = MAILBOX_CONFIG[activeMailbox] || MAILBOX_CONFIG['no-reply@zebrold.de'];
  const filteredLogs = sentLogs.filter(log => {
    if (!logSearch) return true;
    const q = logSearch.toLowerCase();
    return (
      (log.toEmail && log.toEmail.toLowerCase().includes(q)) ||
      (log.toName && log.toName.toLowerCase().includes(q)) ||
      (log.subject && log.subject.toLowerCase().includes(q)) ||
      (log.fromAddress && log.fromAddress.toLowerCase().includes(q))
    );
  });

  return (
    <div className="admin-module admin-mailcenter">
      {/* Header */}
      <div className="admin-module-header">
        <div>
          <h2 className="admin-section-title">Corporate Mail Center &amp; Dispatcher</h2>
          <p className="admin-section-sub">Official communication gateway for <strong>zebrold.de</strong>. Compose, live-preview in real-time, test, and dispatch distinct branded HTML emails across all 3 dedicated mailboxes.</p>
        </div>
      </div>

      {/* Mailbox Selector Tabs */}
      <div className="mailcenter-tabs">
        {[
          { key: 'no-reply@zebrold.de', icon: '🔒', title: 'no-reply@zebrold.de', sub: 'System & Security OTPs', color: '#3B82F6' },
          { key: 'talent.acquisition@zebrold.de', icon: '💼', title: 'talent.acquisition@zebrold.de', sub: 'Talent & Recruitment', color: '#8B3A3A' },
          { key: 'info@zebrold.de', icon: '🌐', title: 'info@zebrold.de', sub: 'Corporate Inquiries & Press', color: '#D4AF37' }
        ].map(mb => (
          <button
            key={mb.key}
            type="button"
            className={`mailcenter-tab-btn ${activeMailbox === mb.key ? 'mailcenter-tab-btn--active' : ''}`}
            onClick={() => setActiveMailbox(mb.key)}
            style={{
              '--tab-color': mb.color,
              borderColor: activeMailbox === mb.key ? mb.color : 'rgba(255,255,255,0.08)'
            }}
          >
            <div className="mailcenter-tab-icon" style={{ background: `${mb.color}22`, color: mb.color }}>{mb.icon}</div>
            <div className="mailcenter-tab-info">
              <span className="mailcenter-tab-addr">{mb.title}</span>
              <span className="mailcenter-tab-sub">{mb.sub}</span>
            </div>
            {activeMailbox === mb.key && <span className="mailcenter-tab-pill" style={{ background: mb.color }}>ACTIVE</span>}
          </button>
        ))}
      </div>

      {/* Active Mailbox Banner */}
      <div className="mailcenter-banner" style={{ borderLeftColor: currentMailboxMeta.badgeColor }}>
        <div className="mailcenter-banner-header">
          <div>
            <strong style={{ color: currentMailboxMeta.badgeColor }}>{currentMailboxMeta.name}</strong>
            <span className="mailcenter-banner-tag">{currentMailboxMeta.headerTag}</span>
          </div>
          <span className="mailcenter-banner-domain">Domain: <code>zebrold.de</code> (Frankfurt Gateway)</span>
        </div>
        <p className="mailcenter-banner-desc">{currentMailboxMeta.purpose}</p>

        {/* Quick Presets Bar */}
        <div className="mailcenter-presets-row">
          <span className="mailcenter-presets-label">⚡ Quick Presets:</span>
          <div className="mailcenter-presets-list">
            {(PRESETS[activeMailbox] || []).map(preset => (
              <button
                key={preset.id}
                type="button"
                className="mailcenter-preset-chip"
                onClick={() => {
                  preset.apply();
                  onSave(`Loaded template preset: "${preset.name}".`);
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dual Workspace: Left Composer, Right Live Simulator */}
      <div className="mailcenter-workspace">
        
        {/* LEFT COLUMN: Interactive Composer */}
        <div className="mailcenter-composer-col">
          <div className="mailcenter-panel-header">
            <h3 className="mailcenter-panel-title">✉️ Email Composer &amp; Dispatch Payload</h3>
            <span className="mailcenter-panel-tag">Sender: {activeMailbox}</span>
          </div>

          <div className="mailcenter-form">

            {/* 1. NO-REPLY SPECIFIC FIELDS */}
            {activeMailbox === 'no-reply@zebrold.de' && (
              <>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Recipient Email *</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      value={noReplyForm.toEmail}
                      onChange={e => setNoReplyForm(p => ({ ...p, toEmail: e.target.value }))}
                      placeholder="admin@zebrold.de"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Recipient Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={noReplyForm.toName}
                      onChange={e => setNoReplyForm(p => ({ ...p, toName: e.target.value }))}
                      placeholder="e.g. Operations Manager"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">Notification Title / Subject *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={noReplyForm.title}
                      onChange={e => setNoReplyForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Admin Password Reset Security Verification"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Alert Tag</label>
                    <input
                      type="text"
                      className="form-input"
                      value={noReplyForm.alertType}
                      onChange={e => setNoReplyForm(p => ({ ...p, alertType: e.target.value.toUpperCase() }))}
                      placeholder="SECURITY VERIFICATION"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label">6-Digit Code / Monospace Highlight</label>
                      <button
                        type="button"
                        className="btn-link-action"
                        onClick={() => setNoReplyForm(p => ({ ...p, otpCode: String(Math.floor(100000 + Math.random() * 900000)) }))}
                      >
                        🎲 Generate Code
                      </button>
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      style={{ letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'monospace' }}
                      value={noReplyForm.otpCode}
                      onChange={e => setNoReplyForm(p => ({ ...p, otpCode: e.target.value }))}
                      placeholder="e.g. 584920 (optional)"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Reference ID / Expiry</label>
                    <input
                      type="text"
                      className="form-input"
                      value={noReplyForm.referenceId}
                      onChange={e => setNoReplyForm(p => ({ ...p, referenceId: e.target.value }))}
                      placeholder="e.g. SEC-OTP-98214"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message Content / Details</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={noReplyForm.message}
                    onChange={e => setNoReplyForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Enter message body..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">Action Button URL (Optional)</label>
                    <input
                      type="url"
                      className="form-input"
                      value={noReplyForm.actionUrl}
                      onChange={e => setNoReplyForm(p => ({ ...p, actionUrl: e.target.value }))}
                      placeholder="https://www.zebrold.de"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Button Label</label>
                    <input
                      type="text"
                      className="form-input"
                      value={noReplyForm.actionText}
                      onChange={e => setNoReplyForm(p => ({ ...p, actionText: e.target.value }))}
                      placeholder="Open Portal"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 2. TALENT SPECIFIC FIELDS */}
            {activeMailbox === 'talent.acquisition@zebrold.de' && (
              <>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Candidate Email *</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      value={talentForm.candidateEmail}
                      onChange={e => setTalentForm(p => ({ ...p, candidateEmail: e.target.value }))}
                      placeholder="candidate@example.com"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Candidate Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={talentForm.candidateName}
                      onChange={e => setTalentForm(p => ({ ...p, candidateName: e.target.value }))}
                      placeholder="e.g. Alex Morgan"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">Job Position Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={talentForm.jobTitle}
                      onChange={e => setTalentForm(p => ({ ...p, jobTitle: e.target.value }))}
                      placeholder="e.g. Senior Full-Stack Software Engineer"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Application Status</label>
                    <select
                      className="form-select"
                      value={talentForm.status}
                      onChange={e => setTalentForm(p => ({ ...p, status: e.target.value }))}
                    >
                      <option value="INTERVIEW">INTERVIEW (Invitation)</option>
                      <option value="HIRED">HIRED (Offer Extended)</option>
                      <option value="SHORTLISTED">SHORTLISTED (Recruiter Review)</option>
                      <option value="UNDER REVIEW">UNDER REVIEW (In Evaluation)</option>
                      <option value="APPLICATION RECEIVED">APPLICATION RECEIVED</option>
                      <option value="REJECTED">REJECTED (Outcome Notice)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Department / Division</label>
                    <input
                      type="text"
                      className="form-input"
                      value={talentForm.department}
                      onChange={e => setTalentForm(p => ({ ...p, department: e.target.value }))}
                      placeholder="Engineering & Technology"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={talentForm.location}
                      onChange={e => setTalentForm(p => ({ ...p, location: e.target.value }))}
                      placeholder="Frankfurt am Main / Hybrid"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Recruiter Message / Letter Body</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={talentForm.customMessage}
                    onChange={e => setTalentForm(p => ({ ...p, customMessage: e.target.value }))}
                    placeholder="Enter recruiter message..."
                  />
                </div>

                {/* Optional Interview Details Card Toggle */}
                <div className="mailcenter-subcard">
                  <label className="mailcenter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={talentForm.hasInterviewDetails}
                      onChange={e => setTalentForm(p => ({ ...p, hasInterviewDetails: e.target.checked }))}
                    />
                    <span>Include Structured Interview Schedule Card</span>
                  </label>

                  {talentForm.hasInterviewDetails && (
                    <div className="mailcenter-subcard-body">
                      <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Date</label>
                          <input
                            type="text"
                            className="form-input"
                            value={talentForm.interviewDate}
                            onChange={e => setTalentForm(p => ({ ...p, interviewDate: e.target.value }))}
                            placeholder="Thursday, August 14, 2026"
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Time &amp; Timezone</label>
                          <input
                            type="text"
                            className="form-input"
                            value={talentForm.interviewTime}
                            onChange={e => setTalentForm(p => ({ ...p, interviewTime: e.target.value }))}
                            placeholder="14:30 CET"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Panel / Interviewer</label>
                          <input
                            type="text"
                            className="form-input"
                            value={talentForm.interviewer}
                            onChange={e => setTalentForm(p => ({ ...p, interviewer: e.target.value }))}
                            placeholder="Dr. Marcus Vance (VP Engineering)"
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Meeting URL</label>
                          <input
                            type="text"
                            className="form-input"
                            value={talentForm.interviewLink}
                            onChange={e => setTalentForm(p => ({ ...p, interviewLink: e.target.value }))}
                            placeholder="https://meet.google.com/zbr-tech-eval"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Offer Details Card Toggle */}
                <div className="mailcenter-subcard">
                  <label className="mailcenter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={talentForm.hasOfferDetails}
                      onChange={e => setTalentForm(p => ({ ...p, hasOfferDetails: e.target.checked }))}
                    />
                    <span>Include Formal Offer Overview Box</span>
                  </label>

                  {talentForm.hasOfferDetails && (
                    <div className="mailcenter-subcard-body">
                      <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Expected Start Date</label>
                          <input
                            type="text"
                            className="form-input"
                            value={talentForm.offerStartDate}
                            onChange={e => setTalentForm(p => ({ ...p, offerStartDate: e.target.value }))}
                            placeholder="October 1, 2026"
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Offer Validity Deadline</label>
                          <input
                            type="text"
                            className="form-input"
                            value={talentForm.offerDeadline}
                            onChange={e => setTalentForm(p => ({ ...p, offerDeadline: e.target.value }))}
                            placeholder="August 25, 2026"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">CTA Button URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={talentForm.actionUrl}
                      onChange={e => setTalentForm(p => ({ ...p, actionUrl: e.target.value }))}
                      placeholder="https://www.zebrold.de/careers"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Button Text</label>
                    <input
                      type="text"
                      className="form-input"
                      value={talentForm.actionText}
                      onChange={e => setTalentForm(p => ({ ...p, actionText: e.target.value }))}
                      placeholder="Confirm Slot"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 3. INFO SPECIFIC FIELDS */}
            {activeMailbox === 'info@zebrold.de' && (
              <>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Recipient Email *</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      value={infoForm.recipientEmail}
                      onChange={e => setInfoForm(p => ({ ...p, recipientEmail: e.target.value }))}
                      placeholder="partner@meridian-capital.de"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Recipient Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={infoForm.recipientName}
                      onChange={e => setInfoForm(p => ({ ...p, recipientName: e.target.value }))}
                      placeholder="Herr Dietrich Weber"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Recipient Company / Organization</label>
                    <input
                      type="text"
                      className="form-input"
                      value={infoForm.company}
                      onChange={e => setInfoForm(p => ({ ...p, company: e.target.value }))}
                      placeholder="Meridian Capital Partners"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Reference Number (Memo Ref)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={infoForm.memoRef}
                      onChange={e => setInfoForm(p => ({ ...p, memoRef: e.target.value }))}
                      placeholder="ZBR-INQ-2026-4402"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">Subject Line *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={infoForm.subject}
                      onChange={e => setInfoForm(p => ({ ...p, subject: e.target.value }))}
                      placeholder="Response to Institutional Partnership Inquiry"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Dispatched From Division</label>
                    <input
                      type="text"
                      className="form-input"
                      value={infoForm.department}
                      onChange={e => setInfoForm(p => ({ ...p, department: e.target.value }))}
                      placeholder="Corporate Relations"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Official Letterhead Message Body</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={infoForm.messageBody}
                    onChange={e => setInfoForm(p => ({ ...p, messageBody: e.target.value }))}
                    placeholder="Enter formal correspondence text..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Executive Callout / Highlight Summary Box</label>
                  <input
                    type="text"
                    className="form-input"
                    value={infoForm.highlightBox}
                    onChange={e => setInfoForm(p => ({ ...p, highlightBox: e.target.value }))}
                    placeholder="e.g. An executive liaison from our Frankfurt Global HQ will coordinate the preliminary agenda."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Signatory Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={infoForm.signatoryName}
                      onChange={e => setInfoForm(p => ({ ...p, signatoryName: e.target.value }))}
                      placeholder="Executive Secretariat"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Signatory Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={infoForm.signatoryTitle}
                      onChange={e => setInfoForm(p => ({ ...p, signatoryTitle: e.target.value }))}
                      placeholder="Zebrold Group Corporate Relations"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">Action Portal URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={infoForm.actionUrl}
                      onChange={e => setInfoForm(p => ({ ...p, actionUrl: e.target.value }))}
                      placeholder="https://www.zebrold.de"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Action Text</label>
                    <input
                      type="text"
                      className="form-input"
                      value={infoForm.actionText}
                      onChange={e => setInfoForm(p => ({ ...p, actionText: e.target.value }))}
                      placeholder="Visit Executive Portal"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Action Toolbar */}
            <div className="mailcenter-actions-bar">
              <button
                type="button"
                className="btn btn-primary mailcenter-send-btn"
                disabled={isSending}
                onClick={() => handleSendEmail(false)}
              >
                {isSending ? '⏳ Dispatching Email...' : `✉️ Dispatch via ${activeMailbox.split('@')[0]}`}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                disabled={isSending}
                onClick={() => handleSendEmail(true)}
                title="Send test email directly to admin inbox"
              >
                🧪 Send Test to Admin
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCopyHtml}
              >
                {copiedHtml ? '✓ Copied HTML!' : '📋 Copy HTML'}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleDownloadHtml}
              >
                💾 Download .html
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Live Responsive Simulator */}
        <div className="mailcenter-preview-col">
          <div className="mailcenter-panel-header">
            <h3 className="mailcenter-panel-title">👁 Real-time Responsive HTML Simulator</h3>
            <div className="mailcenter-view-modes">
              <button
                type="button"
                className={`view-mode-btn ${previewMode === 'desktop' ? 'view-mode-btn--active' : ''}`}
                onClick={() => setPreviewMode('desktop')}
              >
                🖥 Desktop
              </button>
              <button
                type="button"
                className={`view-mode-btn ${previewMode === 'mobile' ? 'view-mode-btn--active' : ''}`}
                onClick={() => setPreviewMode('mobile')}
              >
                📱 Mobile (375px)
              </button>
              <button
                type="button"
                className={`view-mode-btn ${previewMode === 'code' ? 'view-mode-btn--active' : ''}`}
                onClick={() => setPreviewMode('code')}
              >
                📄 HTML Code
              </button>
            </div>
          </div>

          <div className="mailcenter-preview-viewport">
            {previewMode === 'code' ? (
              <div className="mailcenter-code-view">
                <div className="mailcenter-code-header">
                  <span>Pure Standalone HTML (Inline CSS Styled)</span>
                  <button type="button" className="btn-link-action" onClick={handleCopyHtml}>
                    {copiedHtml ? '✓ Copied' : 'Copy All Code'}
                  </button>
                </div>
                <pre className="mailcenter-code-content">
                  <code>{renderedHtml}</code>
                </pre>
              </div>
            ) : (
              <div className={`mailcenter-simulator-frame mailcenter-simulator-frame--${previewMode}`}>
                <div className="mailcenter-sim-topbar">
                  <div className="mailcenter-sim-dots">
                    <span className="dot dot--red"></span>
                    <span className="dot dot--yellow"></span>
                    <span className="dot dot--green"></span>
                  </div>
                  <div className="mailcenter-sim-url">
                    mail.zebrold.de/preview &bull; {activeMailbox}
                  </div>
                </div>

                <div className="mailcenter-sim-body">
                  <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SENT EMAIL DISPATCH HISTORY & AUDIT LOGS */}
      <div className="mailcenter-history-section">
        <div className="mailcenter-history-header">
          <div>
            <h3 className="admin-sub-title" style={{ margin: 0 }}>📋 Sent Dispatches &amp; Audit Logs</h3>
            <p className="admin-section-sub" style={{ margin: 0 }}>Persisted records of all emails dispatched from the Zebrold Admin Console.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search sent emails..."
              className="form-input admin-search-input"
              style={{ width: '220px', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              value={logSearch}
              onChange={e => setLogSearch(e.target.value)}
            />
            {sentLogs.length > 0 && (
              <button type="button" className="btn btn-secondary btn--danger-outline" onClick={handleClearLogs}>
                Clear Logs
              </button>
            )}
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="admin-empty-box" style={{ padding: '2rem 1rem' }}>
            <p>No sent email dispatches recorded yet. Use the composer above to send your first branded email.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp (UTC)</th>
                  <th>Sender Mailbox</th>
                  <th>Recipient</th>
                  <th>Subject</th>
                  <th>Gateway / Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => {
                  const mbColor = MAILBOX_CONFIG[log.fromAddress]?.badgeColor || '#D4AF37';
                  return (
                    <tr key={log.id}>
                      <td style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'monospace' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            background: `${mbColor}22`,
                            color: mbColor,
                            borderColor: `${mbColor}44`,
                            borderWidth: '1px',
                            borderStyle: 'solid'
                          }}
                        >
                          {log.fromAddress}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: '#FFFFFF', display: 'block' }}>{log.toName || 'Recipient'}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>{log.toEmail}</span>
                      </td>
                      <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.subject}
                      </td>
                      <td>
                        <span className="status-badge status-badge--active" style={{ fontSize: '0.7rem' }}>
                          ✓ {log.provider || 'Delivered'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            className="btn-icon"
                            title="View sent email preview"
                            onClick={() => setViewModalLog(log)}
                          >
                            👁 View HTML
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            title="Copy email HTML to clipboard"
                            onClick={() => {
                              navigator.clipboard.writeText(log.htmlContent);
                              onSave('Sent email HTML copied to clipboard.');
                            }}
                          >
                            📋 Copy
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for viewing past sent email */}
      {viewModalLog && (
        <div className="admin-modal-backdrop" onClick={() => setViewModalLog(null)}>
          <div className="admin-modal-card admin-modal-card--email" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="app-modal-tag" style={{ background: '#3B82F6', color: '#FFFFFF' }}>SENT EMAIL RECORD</span>
                <h3 className="admin-modal-title">{viewModalLog.subject}</h3>
                <p className="admin-modal-sub">
                  From: <strong>{viewModalLog.fromAddress}</strong> &bull; To: <strong>{viewModalLog.toName} ({viewModalLog.toEmail})</strong> &bull; {new Date(viewModalLog.timestamp).toLocaleString()}
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setViewModalLog(null)}>✕</button>
            </div>

            <div className="admin-modal-body" style={{ padding: '1rem' }}>
              <div className="email-preview-frame" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                <div dangerouslySetInnerHTML={{ __html: viewModalLog.htmlContent }} />
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(viewModalLog.htmlContent);
                  onSave('HTML copied to clipboard!');
                }}
              >
                📋 Copy HTML
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setViewModalLog(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

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
   APPLICATIONS MODULE  (With Branded Email Notification System)
   ═══════════════════════════════════════════════════════════ */
function ApplicationsModule({ onSave }) {
  const [apps, setApps] = useState(getStoredApplications);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  // Email Notification Modal State
  const [emailModalApp, setEmailModalApp] = useState(null);
  const [emailStatus, setEmailStatus] = useState('Hired');
  const [customMessage, setCustomMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const filtered = apps.filter(a => {
    const matchSearch =
      a.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenEmailModal = (app, statusOverride) => {
    const targetStatus = statusOverride || app.status || 'Hired';
    setEmailModalApp(app);
    setEmailStatus(targetStatus);
    setCopiedHtml(false);

    // Set default status message based on selection
    if (targetStatus === 'Hired') {
      setCustomMessage(`Congratulations! We are thrilled to offer you the position of ${app.jobTitle} at Zebrold. We will be sending over the formal offer letter shortly.`);
    } else if (targetStatus === 'Interview') {
      setCustomMessage(`Great news! We would like to invite you for an interview for the ${app.jobTitle} role at Zebrold. Our hiring team will contact you shortly to schedule a convenient time.`);
    } else if (targetStatus === 'Under Review') {
      setCustomMessage(`Your application for ${app.jobTitle} is currently under active review by our leadership team. We will keep you updated on progress.`);
    } else if (targetStatus === 'Rejected') {
      setCustomMessage(`Thank you for applying for the ${app.jobTitle} position at Zebrold Group. While we were impressed with your qualifications, we have decided to proceed with another candidate at this time.`);
    } else {
      setCustomMessage(`Thank you for your application for the ${app.jobTitle} position at Zebrold Group. We have received your documents.`);
    }
  };

  const handleStatusChange = (appId, newStatus) => {
    const updated = apps.map(a => a.id === appId ? { ...a, status: newStatus } : a);
    setApps(updated);
    saveApplications(updated);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(p => ({ ...p, status: newStatus }));
    }
    const targetApp = apps.find(a => a.id === appId);
    if (targetApp) {
      handleOpenEmailModal(targetApp, newStatus);
    }
    onSave(`Application status updated to ${newStatus}.`);
  };

  const handleSendEmailNotification = async () => {
    if (!emailModalApp) return;
    setSendingEmail(true);

    const res = await sendCandidateStatusEmail({
      candidateName: emailModalApp.candidateName,
      email: emailModalApp.email,
      jobTitle: emailModalApp.jobTitle,
      status: emailStatus,
      customMessage: customMessage,
    });

    setSendingEmail(false);
    setEmailModalApp(null);
    onSave(`Branded email notification dispatched to ${emailModalApp.candidateName} (${emailModalApp.email}).`);
  };

  const handleCopyEmailHtml = () => {
    if (!emailModalApp) return;
    const htmlContent = generateCandidateStatusEmailHtml({
      candidateName: emailModalApp.candidateName,
      jobTitle: emailModalApp.jobTitle,
      status: emailStatus,
      customMessage: customMessage,
    });
    navigator.clipboard.writeText(htmlContent);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
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
    <div className="admin-module admin-module--wide">
      <div className="admin-module-header">
        <div>
          <h2 className="admin-section-title">CV & Candidate Applications</h2>
          <p className="admin-section-sub">Review job applications, view candidate profiles, and dispatch branded website-themed email notifications.</p>
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
                      <button
                        className="btn-table-action btn-table-action--email"
                        onClick={() => handleOpenEmailModal(app)}
                        title="Send Branded Email Notification"
                      >
                        📧 Send Email
                      </button>
                      <button className="btn-table-action" onClick={() => setSelectedApp(app)}>
                        👁 View
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

      {/* Candidate Profile Detail Modal */}
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
              <button
                className="btn btn-primary"
                onClick={() => {
                  const appToEmail = selectedApp;
                  setSelectedApp(null);
                  handleOpenEmailModal(appToEmail);
                }}
              >
                📧 Compose Branded Email Update
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* BRANDED EMAIL NOTIFICATION & PREVIEW MODAL */}
      {emailModalApp && (
        <div className="admin-modal-backdrop" onClick={() => setEmailModalApp(null)}>
          <div className="admin-modal-card admin-modal-card--email" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="app-modal-tag">BRANDED EMAIL NOTIFICATION</span>
                <h3 className="admin-modal-title">Email to {emailModalApp.candidateName}</h3>
                <p className="admin-modal-sub">Candidate: <strong>{emailModalApp.email}</strong> &bull; Position: <strong>{emailModalApp.jobTitle}</strong></p>
              </div>
              <button className="modal-close-btn" onClick={() => setEmailModalApp(null)}>✕</button>
            </div>

            <div className="admin-modal-body admin-email-modal-body">
              {/* Controls */}
              <div className="email-modal-controls">
                <div className="form-group">
                  <label className="form-label">Notification Status Template</label>
                  <select
                    className="form-select"
                    value={emailStatus}
                    onChange={(e) => {
                      const st = e.target.value;
                      setEmailStatus(st);
                      if (st === 'Hired') {
                        setCustomMessage(`Congratulations! We are thrilled to offer you the position of ${emailModalApp.jobTitle} at Zebrold. We will be sending over the formal offer letter shortly.`);
                      } else if (st === 'Interview') {
                        setCustomMessage(`Great news! We would like to invite you for an interview for the ${emailModalApp.jobTitle} position at Zebrold. Our hiring team will contact you shortly to schedule a convenient time.`);
                      } else if (st === 'Under Review') {
                        setCustomMessage(`Your application for ${emailModalApp.jobTitle} is currently under active review by our leadership team. We will keep you updated on progress.`);
                      } else if (st === 'Rejected') {
                        setCustomMessage(`Thank you for applying for the ${emailModalApp.jobTitle} position at Zebrold Group. While we were impressed with your qualifications, we have decided to proceed with another candidate at this time.`);
                      } else {
                        setCustomMessage(`Thank you for your application for the ${emailModalApp.jobTitle} position at Zebrold Group. We have received your documents and your profile is being reviewed.`);
                      }
                    }}
                  >
                    <option value="Hired">HIRED (Offer Letter / Welcome)</option>
                    <option value="Interview">INTERVIEW (Invitation)</option>
                    <option value="Under Review">UNDER REVIEW (Status Update)</option>
                    <option value="Application Received">APPLICATION RECEIVED (Confirmation)</option>
                    <option value="Rejected">REJECTED (Outcome Notice)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Custom Message Content</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter candidate notification body..."
                  />
                </div>
              </div>

              {/* LIVE EMAIL PREVIEW */}
              <div className="email-preview-container">
                <div className="email-preview-header-bar">
                  <span>LIVE BRANDED EMAIL PREVIEW</span>
                  <span className="email-preview-badge">Zebrold Theme Enabled</span>
                </div>

                {/* Rendered HTML inside preview frame */}
                <div className="email-preview-frame">
                  <div
                    className="email-rendered-wrapper"
                    dangerouslySetInnerHTML={{
                      __html: generateCandidateStatusEmailHtml({
                        candidateName: emailModalApp.candidateName,
                        jobTitle: emailModalApp.jobTitle,
                        status: emailStatus,
                        customMessage: customMessage,
                      })
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCopyEmailHtml}
              >
                {copiedHtml ? '✓ HTML Copied!' : '📋 Copy Email HTML'}
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={sendingEmail}
                onClick={handleSendEmailNotification}
              >
                {sendingEmail ? 'Sending Email...' : '✉️ Send Branded Email to Candidate'}
              </button>
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
   SECURITY & LOGINS MODULE
   ═══════════════════════════════════════════════════════════ */
function SecurityModule({ onSave, session }) {
  const accounts = getAdminAccounts();
  const [selectedAcc, setSelectedAcc] = useState(accounts[0]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sendingReset, setSendingReset] = useState(false);
  const [resetModalInfo, setResetModalInfo] = useState(null);

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }

    const res = changeAdminPassword(selectedAcc.email, oldPassword, newPassword);
    if (res.success) {
      onSave(res.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert(res.error);
    }
  };

  const handleTriggerEmailReset = async (email) => {
    setSendingReset(true);
    const res = await requestPasswordResetCode(email);
    setSendingReset(false);

    if (res.success) {
      setResetModalInfo(res);
      onSave(`Password reset verification code dispatched via email to ${email}.`);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="admin-module admin-module--wide">
      <div className="admin-module-header">
        <div>
          <h2 className="admin-section-title">Security & Admin Logins</h2>
          <p className="admin-section-sub">Manage Dual Admin Accounts, credentials, and email password reset access.</p>
        </div>
      </div>

      {/* Account Cards */}
      <h3 className="admin-sub-title">Admin Accounts (Dual Login Configuration)</h3>
      <div className="admin-accounts-grid">
        {accounts.map(acc => {
          const isActive = session && session.email.toLowerCase() === acc.email.toLowerCase();
          return (
            <div key={acc.id} className={`admin-account-card-box ${isActive ? 'admin-account-card-box--active' : ''}`}>
              {isActive && <span className="admin-active-badge">Active Session</span>}
              <div className="admin-acc-box-header">
                <div>
                  <h4 className="admin-acc-box-title">{acc.role}</h4>
                  <p className="admin-acc-box-sub">{acc.email}</p>
                </div>
              </div>

              <div className="admin-acc-details-list">
                <div><strong>Department:</strong> {acc.department}</div>
                <div><strong>Permissions:</strong> {acc.permissions}</div>
                <div><strong>Current Password:</strong> <code style={{ background: '#f5f2e8', padding: '2px 6px', borderRadius: '4px' }}>{acc.password}</code></div>
                {acc.lastLogin && <div><strong>Last Login:</strong> {new Date(acc.lastLogin).toLocaleString()}</div>}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                  onClick={() => setSelectedAcc(acc)}
                >
                  ✏ Change Password
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                  disabled={sendingReset}
                  onClick={() => handleTriggerEmailReset(acc.email)}
                >
                  ✉️ Send Email Reset
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Change Password Form */}
      <div style={{ marginTop: '2.5rem', background: '#fff', padding: '1.75rem', borderRadius: '8px', border: '1px solid #eee' }}>
        <h3 className="admin-sub-title">Change Password for {selectedAcc.role}</h3>
        <form onSubmit={handleChangePassword} className="admin-form">
          <div className="form-group">
            <label className="form-label">Target Account Email</label>
            <input type="text" disabled className="form-input" value={selectedAcc.email} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Current Password *</label>
              <input
                type="password"
                required
                className="form-input"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password (Min 6 chars) *</label>
              <input
                type="password"
                required
                className="form-input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password *</label>
            <input
              type="password"
              required
              className="form-input"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              🔒 Save Updated Password
            </button>
          </div>
        </form>
      </div>

      {/* Reset Email Code Preview Modal */}
      {resetModalInfo && (
        <div className="admin-modal-backdrop" onClick={() => setResetModalInfo(null)}>
          <div className="admin-modal-card admin-modal-card--email" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="app-modal-tag">BRANDED EMAIL SENT</span>
                <h3 className="admin-modal-title">Reset Code Dispatched</h3>
                <p className="admin-modal-sub">Sent to <strong>{resetModalInfo.email}</strong></p>
              </div>
              <button className="modal-close-btn" onClick={() => setResetModalInfo(null)}>✕</button>
            </div>

            <div className="admin-modal-body" style={{ padding: '1rem' }}>
              <div className="admin-otp-callout" style={{ background: '#222523', margin: '0 0 1rem 0' }}>
                <div className="admin-otp-title">GENERATED VERIFICATION CODE</div>
                <div className="admin-otp-code">{resetModalInfo.resetCode}</div>
                <div className="admin-otp-note">Code valid for 15 minutes. Delivered via email notification.</div>
              </div>

              <div className="email-preview-frame" style={{ border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                <div dangerouslySetInnerHTML={{ __html: resetModalInfo.htmlPreview }} />
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setResetModalInfo(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN LOGIN PORTAL COMPONENT
   ═══════════════════════════════════════════════════════════ */
function AdminLogin({ onLoginSuccess, showToast }) {
  const accounts = getAdminAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState('admin-master');
  const [email, setEmail] = useState('admin@zebrold.de');
  const [password, setPassword] = useState('');
  const [viewMode, setViewMode] = useState('login'); // 'login' | 'forgot-password' | 'enter-code'

  // Reset state
  const [resetEmail, setResetEmail] = useState('admin@zebrold.de');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeResetInfo, setActiveResetInfo] = useState(null);
  const [sendingReset, setSendingReset] = useState(false);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);

  const handleAccountSelect = (acc) => {
    setSelectedAccountId(acc.id);
    setEmail(acc.email);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const result = validateAdminLogin(email, password);
    if (result.success) {
      onLoginSuccess(result.session);
      showToast(`Welcome back, ${result.account.role}!`);
    } else {
      alert(result.error);
    }
  };

  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    setSendingReset(true);
    const res = await requestPasswordResetCode(resetEmail);
    setSendingReset(false);

    if (res.success) {
      setActiveResetInfo(res);
      setViewMode('enter-code');
      showToast(`Security verification code dispatched to ${res.email}.`);
    } else {
      alert(res.error);
    }
  };

  const handleVerifyAndReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    const res = updatePasswordWithResetCode(resetEmail, resetCode, newPassword);
    if (res.success) {
      showToast(res.message);
      onLoginSuccess(res.session);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo-mark">
            <img src={zebroldLogoMark} alt="Zebrold Logo" className="admin-login-logo-img" />
          </div>
          <h2 className="admin-login-brand-title">ZEBROLD GROUP</h2>
          <span className="admin-login-brand-sub">ADMIN CONSOLE PORTAL</span>
        </div>

        <div className="admin-login-body">
          {viewMode === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div className="admin-account-selector-label">
                <span>Select Admin Login Account</span>
                <span style={{ color: 'var(--color-gold, #d4af37)' }}>Dual Access Enabled</span>
              </div>

              <div className="admin-account-selector-grid">
                {accounts.map(acc => (
                  <button
                    key={acc.id}
                    type="button"
                    className={`admin-account-btn ${selectedAccountId === acc.id ? 'admin-account-btn--selected' : ''}`}
                    onClick={() => handleAccountSelect(acc)}
                  >
                    <span className="admin-account-role">{acc.role}</span>
                    <span className="admin-account-email">{acc.email}</span>
                  </button>
                ))}
              </div>

              <div className="form-group admin-login-field">
                <label className="form-label">Admin Email Address</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group admin-login-field">
                <label className="form-label">Account Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter account password..."
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div className="admin-login-actions">
                <button type="submit" className="btn-login-submit">
                  Log In to Console →
                </button>

                <button
                  type="button"
                  className="btn-forgot-password"
                  onClick={() => {
                    setResetEmail(email);
                    setViewMode('forgot-password');
                  }}
                >
                  🔑 Forgot Password? Reset Access via Email
                </button>
              </div>
            </form>
          )}

          {viewMode === 'forgot-password' && (
            <form onSubmit={handleRequestResetCode}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#fff' }}>
                Reset Admin Password
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Enter your registered admin email address. We will dispatch a 6-digit cryptographic security code.
              </p>

              <div className="admin-account-selector-grid" style={{ marginBottom: '1rem' }}>
                {accounts.map(acc => (
                  <button
                    key={acc.id}
                    type="button"
                    className={`admin-account-btn ${resetEmail === acc.email ? 'admin-account-btn--selected' : ''}`}
                    onClick={() => setResetEmail(acc.email)}
                  >
                    <span className="admin-account-role">{acc.role}</span>
                    <span className="admin-account-email">{acc.email}</span>
                  </button>
                ))}
              </div>

              <div className="form-group admin-login-field">
                <label className="form-label">Registered Admin Email</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                />
              </div>

              <div className="admin-login-actions">
                <button type="submit" className="btn-login-submit" disabled={sendingReset}>
                  {sendingReset ? 'Dispatching Verification Code...' : '✉️ Send 6-Digit Verification Code →'}
                </button>

                <button
                  type="button"
                  className="btn-forgot-password"
                  onClick={() => setViewMode('login')}
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}

          {viewMode === 'enter-code' && (
            <form onSubmit={handleVerifyAndReset}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#fff' }}>
                Verify Code & Change Password
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                A 6-digit verification code has been dispatched to <strong>{resetEmail}</strong>.
              </p>

              {activeResetInfo && activeResetInfo.resetCode && (
                <div className="admin-otp-callout">
                  <div className="admin-otp-title">⚡ SECURITY VERIFICATION CODE</div>
                  <div className="admin-otp-code">{activeResetInfo.resetCode}</div>
                  <div className="admin-otp-note">
                    Email dispatched via notification service.<br />
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#d4af37', textDecoration: 'underline', cursor: 'pointer', marginTop: '4px', fontSize: '0.75rem' }}
                      onClick={() => setShowEmailPreviewModal(true)}
                    >
                      👁 View Sent Branded Email HTML
                    </button>
                  </div>
                </div>
              )}

              <div className="form-group admin-login-field">
                <label className="form-label">6-Digit Verification Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 584920"
                  maxLength={6}
                  className="form-input"
                  style={{ letterSpacing: '0.2em', fontWeight: 700, textAlign: 'center', fontSize: '1.1rem' }}
                  value={resetCode}
                  onChange={e => setResetCode(e.target.value)}
                />
              </div>

              <div className="form-group admin-login-field">
                <label className="form-label">New Password (Min 6 characters)</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new strong password..."
                  className="form-input"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-group admin-login-field">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password..."
                  className="form-input"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="admin-login-actions">
                <button type="submit" className="btn-login-submit">
                  🔒 Update Password & Log In →
                </button>

                <button
                  type="button"
                  className="btn-forgot-password"
                  onClick={() => setViewMode('login')}
                >
                  Cancel / Return to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Email Preview Modal */}
      {showEmailPreviewModal && activeResetInfo && (
        <div className="admin-modal-backdrop" onClick={() => setShowEmailPreviewModal(false)}>
          <div className="admin-modal-card admin-modal-card--email" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="app-modal-tag">BRANDED EMAIL DISPATCH PREVIEW</span>
                <h3 className="admin-modal-title">Password Reset Code Email</h3>
                <p className="admin-modal-sub">Sent to <strong>{activeResetInfo.email}</strong></p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowEmailPreviewModal(false)}>✕</button>
            </div>
            <div className="admin-modal-body" style={{ padding: '1rem' }}>
              <div className="email-preview-frame" style={{ border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                <div dangerouslySetInnerHTML={{ __html: activeResetInfo.htmlPreview }} />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEmailPreviewModal(false)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN (main)
   ═══════════════════════════════════════════════════════════ */
export default function Admin() {
  const [session, setSession] = useState(getActiveSession);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = useCallback((msg) => {
    setToast({ message: msg, type: 'success' });
  }, []);

  const handleLogout = () => {
    logoutAdminSession();
    setSession(null);
    showToast('Logged out of Admin Console.');
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'mailcenter': return <MailCenterModule onSave={showToast} session={session} />;
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
      case 'security': return <SecurityModule onSave={showToast} session={session} />;
      case 'settings': return <SettingsModule onSave={showToast} />;
      default: return <Dashboard />;
    }
  };

  if (!session) {
    return (
      <>
        <AdminLogin
          onLoginSuccess={(newSession) => setSession(newSession)}
          showToast={showToast}
        />
        {toast && (
          <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
        )}
      </>
    );
  }

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
            <img src={zebroldLogoMark} alt="Zebrold Group Logo" className="admin-logo-img" loading="eager" width="120" height="40" />
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
          <p className="admin-sidebar-note">Frontend CMS — Dual Login Enabled</p>
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
            <div className="admin-topbar-profile">
              <div className="admin-user-pill">
                <div className="admin-user-info">
                  <span className="admin-user-role">{session.role}</span>
                  <span className="admin-user-email">{session.email}</span>
                </div>
              </div>
              <button
                className="btn-topbar-sec"
                onClick={() => setActiveModule('security')}
                title="Security & Account Management"
              >
                🔑 Password
              </button>
              <button
                className="btn-topbar-sec btn-logout"
                onClick={handleLogout}
                title="Logout"
              >
                🚪 Logout
              </button>
            </div>
            <a href="/" className="admin-topbar-site-link" target="_blank" rel="noopener noreferrer">
              View Live Site ↗
            </a>
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
