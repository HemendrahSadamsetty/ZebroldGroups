// Default Careers Job Openings Data & LocalStorage Helpers

export const DEFAULT_JOBS = [
  {
    id: "job-101",
    title: "Senior Portfolio Analyst",
    department: "Investment & Finance",
    location: "Frankfurt, Germany",
    type: "Full-Time",
    experience: "5+ Years",
    status: "Active",
    description: "Lead capital allocation models and portfolio performance evaluation across Zebrold Group's EUR 2.1B subsidiary network. Work closely with executive leadership on industrial growth mandates.",
    requirements: [
      "Master's degree in Finance, Economics, or Quantitative discipline",
      "5+ years experience in Private Equity, Investment Banking, or Corporate M&A",
      "Advanced financial modeling (DCF, LBO, Portfolio Sensitivity)",
      "Fluency in German and English required"
    ],
    postedDate: "2026-07-15"
  },
  {
    id: "job-107",
    title: "Full-Stack Software Engineer Intern",
    department: "Software & AI",
    location: "Remote / Hybrid",
    type: "Internship",
    experience: "Computer Science",
    internshipType: "Remote",
    duration: "3 Months",
    stipend: "Unpaid Based On Performance",
    conversion: "Performance-based full-time opportunity",
    status: "Active",
    roleSummary: "As a Full-Stack Software Engineer Intern, you will work on building end-to-end software platforms, internal tools, and dashboards using modern web technologies. This role provides hands-on exposure to real startup software systems used internally and by clients.",
    keyResponsibilities: [
      "Develop frontend and backend features for web-based applications",
      "Build dashboards, admin panels, and workflow-driven tools",
      "Integrate APIs, AI services, and cloud components",
      "Collaborate with backend, AI, and product teams",
      "Write clean, maintainable, and well-documented code"
    ],
    requiredSkills: [
      "JavaScript / TypeScript fundamentals",
      "React or similar frontend framework",
      "Basic backend knowledge (Node.js or Python)",
      "Git-based version control"
    ],
    positionExpectations: [
      "Ensure smooth and timely execution of projects",
      "Contribute ideas and work with Product Management as well as technical and senior leadership",
      "Appropriately allocate team resources, balancing efforts between building new features and supporting/maintaining previous releases"
    ],
    description: "As a Full-Stack Software Engineer Intern, you will work on building end-to-end software platforms...",
    requirements: [
      "JavaScript / TypeScript fundamentals",
      "React or similar frontend framework"
    ],
    postedDate: "2026-07-22"
  },
  {
    id: "job-102",
    title: "Lead Energy Systems Architect",
    department: "Engineering & CleanTech",
    location: "Munich, Germany",
    type: "Full-Time",
    experience: "7+ Years",
    status: "Active",
    description: "Architect utility-scale renewable energy storage hardware and microgrid integration for Northvolt Power and industrial subsidiary facilities.",
    requirements: [
      "M.Sc. or Ph.D. in Electrical Engineering, Energy Systems, or Power Electronics",
      "Proven track record in high-voltage grid storage and battery systems",
      "Experience with European power grid standards and hardware lifecycle",
      "Fluency in English; German proficiency preferred"
    ],
    postedDate: "2026-07-18"
  },
  {
    id: "job-103",
    title: "M&A Associate — Global Infrastructure",
    department: "Corporate Strategy",
    location: "London, UK",
    type: "Full-Time",
    experience: "3-5 Years",
    status: "Active",
    description: "Evaluate target acquisitions, execute due diligence, and integrate acquired industrial assets across European and Asian key growth regions.",
    requirements: [
      "B.Sc./M.Sc. from top tier university",
      "3+ years in M&A advisory, infrastructure funds, or corporate development",
      "Strong deal execution skills and cross-border commercial acumen",
      "Native or business-fluent English"
    ],
    postedDate: "2026-07-10"
  },
  {
    id: "job-104",
    title: "Healthcare Innovation Manager",
    department: "Healthcare & MedTech",
    location: "Dresden, Germany",
    type: "Hybrid",
    experience: "4+ Years",
    status: "Active",
    description: "Drive strategic partnerships and technology transfers between MedTech subsidiaries and European research institutes.",
    requirements: [
      "Background in Biomedical Engineering, Life Sciences, or HealthTech Operations",
      "Experience navigating ISO 13485 & CE marking frameworks",
      "Strong project management and stakeholder negotiation abilities",
      "German & English fluency"
    ],
    postedDate: "2026-07-02"
  },
  {
    id: "job-105",
    title: "Senior Data Engineer — Industrial IoT",
    department: "Software & AI",
    location: "Remote / Munich",
    type: "Full-Time",
    experience: "5+ Years",
    status: "Active",
    description: "Build low-latency telemetry pipelines and predictive maintenance analytics for heavy machinery across Group manufacturing sites.",
    requirements: [
      "Deep expertise in Python, Rust or Go, Kafka, and cloud data platforms",
      "Experience with industrial IoT protocols (OPC UA, MQTT) and time-series DBs",
      "High standard for clean, resilient, self-healing code",
      "Fluent English"
    ],
    postedDate: "2026-07-20"
  },
  {
    id: "job-106",
    title: "Executive Talent Acquisition Partner",
    department: "Human Resources",
    location: "Munich, Germany",
    type: "Full-Time",
    experience: "6+ Years",
    status: "Active",
    description: "Source executive leadership and specialized engineering talent for senior positions across all 26 Zebrold Group subsidiaries.",
    requirements: [
      "6+ years executive search or talent acquisition experience in tech/industrial sectors",
      "Demonstrated ability to close C-suite and VP-level engineering leadership",
      "Strong candidate evaluation and employer branding skills",
      "German & English business fluency"
    ],
    postedDate: "2026-06-28"
  }
];

export const DEFAULT_APPLICATIONS = [
  {
    id: "app-201",
    jobId: "job-101",
    jobTitle: "Senior Portfolio Analyst",
    candidateName: "Dr. Alexander Weber",
    email: "a.weber@example.com",
    phone: "+49 171 8920192",
    linkedin: "https://linkedin.com/in/alexander-weber-demo",
    coverNote: "I have spent 6 years at Deutsche Bank Corporate Finance evaluating European industrial conglomerates. Zebrold's portfolio strategy aligns perfectly with my background in capital deployment.",
    cvFile: {
      name: "CV_Dr_Alexander_Weber_2026.pdf",
      size: 428000,
      type: "application/pdf",
      dataUrl: "data:application/pdf;base64,JVBERi0xLjQKJ..."
    },
    appliedDate: "2026-07-21T14:30:00Z",
    status: "Under Review"
  },
  {
    id: "app-202",
    jobId: "job-102",
    jobTitle: "Lead Energy Systems Architect",
    candidateName: "Elena Rostova",
    email: "elena.rostova@example.com",
    phone: "+49 160 5543110",
    linkedin: "https://linkedin.com/in/elena-rostova-energy",
    coverNote: "Having led hardware validation for grid storage systems in Scandinavia, I am eager to bring my expertise to Northvolt Power and Zebrold CleanTech.",
    cvFile: {
      name: "Elena_Rostova_Resume.pdf",
      size: 512000,
      type: "application/pdf",
      dataUrl: "data:application/pdf;base64,JVBERi0xLjQKJ..."
    },
    appliedDate: "2026-07-22T09:15:00Z",
    status: "New"
  }
];

// Helper functions
export function getStoredJobs() {
  try {
    const data = localStorage.getItem('zebrold_careers_jobs');
    if (!data) return DEFAULT_JOBS;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_JOBS;
  } catch (e) {
    return DEFAULT_JOBS;
  }
}

export function saveJobs(jobs) {
  try {
    localStorage.setItem('zebrold_careers_jobs', JSON.stringify(jobs));
  } catch (e) {
    console.error('Failed to save jobs to localStorage', e);
  }
}

export function getStoredApplications() {
  try {
    const data = localStorage.getItem('zebrold_applications');
    if (!data) return DEFAULT_APPLICATIONS;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : DEFAULT_APPLICATIONS;
  } catch (e) {
    return DEFAULT_APPLICATIONS;
  }
}

export function saveApplications(apps) {
  try {
    localStorage.setItem('zebrold_applications', JSON.stringify(apps));
  } catch (e) {
    console.error('Failed to save applications to localStorage', e);
  }
}

export function addApplication(appData) {
  const current = getStoredApplications();
  const newApp = {
    id: `app-${Date.now()}`,
    appliedDate: new Date().toISOString(),
    status: 'New',
    ...appData
  };
  const updated = [newApp, ...current];
  saveApplications(updated);
  return newApp;
}
