/**
 * homepageData.js
 * Shared data layer between Admin dashboard and Homepage.
 * Every section has a well-known localStorage key, a getter that falls back
 * to hardcoded defaults, and a setter that writes to localStorage.
 *
 * The Homepage reads via get*(), the Admin writes via save*().
 * If no admin edits exist, the homepage renders its original defaults.
 */

/* ── Generic helpers ── */
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* ══════════════════════════════════════════════════════
   EXPERTISE CARDS  (3 cards)
   ══════════════════════════════════════════════════════ */
const EXPERTISE_DEFAULTS = [
  {
    id: 'industrial-excellence',
    num: '01',
    caption_de: 'Industrielle Exzellenz',
    caption_en: 'Industrial Excellence',
    title_de: 'Ingenieurspräzision auf institutioneller Ebene',
    title_en: 'Institutional-Grade Engineering Precision',
    body_de: 'Wir entwerfen, bauen und betreiben Infrastruktur in zwölf Sektoren — von der Halbleiterfertigung bis zu sauberen Energienetzen. Unsere Tochtergesellschaften liefern industrielle Lösungen mit deutscher Ingenieurspräzision und verbinden fortschrittliche Fertigungskapazitäten mit nachhaltigen Praktiken auf globalen Märkten.',
    body_en: 'We design, build and operate infrastructure across twelve sectors — from semiconductor fabrication to clean energy grids. Our subsidiaries deliver industrial solutions with German engineering precision, combining advanced manufacturing capabilities with sustainable practices across global markets.',
    cta_de: 'Sektoren erkunden',
    cta_en: 'Explore Sectors',
    ctaPath: '/sectors',
    imageKey: 'semi_sector',
  },
  {
    id: 'healthcare-education',
    num: '02',
    caption_de: 'Gesundheitswesen & Bildung',
    caption_en: 'Healthcare & Education',
    title_de: 'Innovation im Gesundheitswesen und in der Bildung',
    title_en: 'Innovation in Healthcare and Education',
    body_de: 'Wir investieren in die Zukunft menschlichen Wohlergehens und Wissensaufbaus. Durch spezialisierte Tochtergesellschaften verbinden wir lebensrettende Medizintechnik mit moderner Bildungs- und Plattformtechnologie für globale Märkte.',
    body_en: 'We invest in the future of human well-being and knowledge building. Through specialized subsidiaries, we combine life-saving medical technology with modern education and platform technology for global markets.',
    cta_de: 'Initiativen entdecken',
    cta_en: 'Discover Initiatives',
    ctaPath: '/sectors',
    imageKey: 'healthcare_sector',
  },
  {
    id: 'global-presence',
    num: '03',
    caption_de: 'Globale Präsenz',
    caption_en: 'Global Presence',
    title_de: 'Lokale Expertise, globale Infrastruktur',
    title_en: 'Local Expertise, Global Infrastructure',
    body_de: 'Mit Produktionsstätten in München und Dresden, Vertriebszentren in 22 europäischen Märkten und Standorten auf drei Kontinenten kombinieren wir tiefes lokales Wissen mit Ausführung im institutionellen Maßstab. Unsere Teams arbeiten weltweit in regulierten, präzisionskritischen Umgebungen.',
    body_en: 'With manufacturing facilities in Munich and Dresden, distribution centres across 22 European markets, and offices on three continents, we combine deep local knowledge with institutional-scale execution.',
    cta_de: 'Unsere Büros',
    cta_en: 'Our Offices',
    ctaPath: '/offices',
    imageKey: 'hero_bg_everstone',
  },
];

export function getExpertise() {
  return load('zebrold_expertise', EXPERTISE_DEFAULTS);
}
export function saveExpertise(data) {
  save('zebrold_expertise', data);
}
export { EXPERTISE_DEFAULTS };

/* ══════════════════════════════════════════════════════
   DOMAINS / SECTORS  (12 items)
   ══════════════════════════════════════════════════════ */
const DOMAINS_DEFAULTS = [
  { id: 'ev-battery', title: 'EV-Laden & Batterien', subtitle: 'EV Charging & Battery', companies: 'Everstone Energy, Northvolt Power' },
  { id: 'semiconductors', title: 'Halbleiter', subtitle: 'Semiconductors', companies: 'Meridian Microelectronics, Silicon Crest' },
  { id: 'car-manufacturing', title: 'Automobilbau', subtitle: 'Car Manufacturing', companies: 'Redford Automotive, Westbridge Motors' },
  { id: 'education', title: 'Bildung', subtitle: 'Education', companies: 'Instructis, Brighton Education, Clearpath' },
  { id: 'technology', title: 'Technologie & IT', subtitle: 'Technology & IT', companies: 'Skybridge Technologies, Arden Digital' },
  { id: 'finance', title: 'Finanzen & Investitionen', subtitle: 'Finance & Investment', companies: 'Sterling Financial, Harrington Capital' },
  { id: 'healthcare', title: 'Gesundheitswesen & Pharma', subtitle: 'Healthcare & Pharma', companies: 'Country Health, Oakwell, Greenford' },
  { id: 'logistics', title: 'Logistik & Lieferkette', subtitle: 'Logistics & Supply Chain', companies: 'PrimeRoute Logistics, GlobalLink' },
  { id: 'retail', title: 'Einzelhandel & Konsumgüter', subtitle: 'Retail & Consumer', companies: 'PrimeMart Retail, UrbanBasket Stores' },
  { id: 'agriculture', title: 'Landwirtschaft & Lebensmittel', subtitle: 'Agriculture & Food', companies: 'Greenfield Agri, Harvest Hill Foods' },
  { id: 'industrial', title: 'Industrie & Maschinenbau', subtitle: 'Industrial & Engineering', companies: 'Ironclad Engineering, Stonebridge' },
  { id: 'media', title: 'Medien & Unterhaltung', subtitle: 'Media & Entertainment', companies: 'Northstar Entertainment, Silverline' },
];

export function getDomains() {
  return load('zebrold_domains', DOMAINS_DEFAULTS);
}
export function saveDomains(data) {
  save('zebrold_domains', data);
}
export { DOMAINS_DEFAULTS };

/* ══════════════════════════════════════════════════════
   STATS  (3 items)
   ══════════════════════════════════════════════════════ */
const STATS_DEFAULTS = [
  { value: 2.1, prefix: '€', suffix: ' Mrd.', label_de: 'Umsatz der Tochtergesellschaften', label_en: 'Subsidiary Revenue' },
  { value: 26, prefix: '', suffix: '', label_de: 'Unternehmen in unserem Portfolio', label_en: 'Companies in Our Portfolio' },
  { value: 40, prefix: '+', suffix: '%', label_de: 'Wachstum gegenüber dem Vorjahr in Schlüsselsektoren', label_en: 'Year-over-Year Growth in Key Sectors' },
];

export function getStats() {
  return load('zebrold_stats', STATS_DEFAULTS);
}
export function saveStats(data) {
  save('zebrold_stats', data);
}
export { STATS_DEFAULTS };

/* ══════════════════════════════════════════════════════
   NEWS SECTION  (homepage news cards)
   ══════════════════════════════════════════════════════ */
const NEWS_SECTION_DEFAULTS = {
  featured: {
    tag_de: 'Pressemitteilung',
    tag_en: 'Press Release',
    title_de: 'Zebrold erwirbt Mehrheitsbeteiligung an Meridian Microelectronics',
    title_en: 'Zebrold Acquires Majority Stake in Meridian Microelectronics',
    desc_de: 'Die Zebrold Group hat den Erwerb einer Kontrollmehrheit von 72 % an Meridian Microelectronics abgeschlossen und stärkt damit ihre Position in der globalen Halbleiter-Wertschöpfungskette.',
    desc_en: 'The Zebrold Group has completed the acquisition of a 72% controlling interest in Meridian Microelectronics, reinforcing its position in the global semiconductor value chain.',
  },
  facts: {
    tag_de: 'FAKTEN',
    tag_en: 'FACTS',
    title_de: 'Wussten Sie schon',
    title_en: 'Did You Know',
    body_de: 'Zebrold leistete Pionierarbeit bei der klimaneutralen Letzte-Meile-Logistik in Europa: Der Zebrold Logistics Service wurde am 15. Oktober 2013 gegründet. Später wurde daraus PrimeRoute Logistics.',
    body_en: 'Zebrold pioneered zero-emission last-mile logistics in Europe: Zebrold Logistics Service was founded on October 15, 2013, later evolving into PrimeRoute Logistics.',
  },
  facebook: {
    body_de: 'Die Spannung kehrt zurück! Willkommen zu einer neuen Saison unseres globalen Technologiegipfels. Die Teams sind bereit und präsentieren die Innovationen von morgen. Sind Sie es auch?',
    body_en: 'The excitement returns! Welcome to a new season of our global technology summit. The teams are ready and showcasing tomorrow\'s innovations. Are you?',
    hashtags: '#ZebroldGroups #InnovationSummit #FutureTech2026',
    date_de: 'Vor 3 Monaten',
    date_en: '3 months ago',
  },
  instagram: {
    body_de: 'Das Warten hat ein Ende. Die Spannung kehrt zurück. Willkommen zurück zu einer neuen Saison des #ZebroldSummit. Die Teams sind bereit. Sind Sie es auch?',
    body_en: 'The wait is over. The excitement returns. Welcome back to a new season of #ZebroldSummit. The teams are ready. Are you?',
    hashtags: '#ZebroldGroups #TechSummit #Innovation2026',
    date_de: 'Vor 3 Monaten',
    date_en: '3 months ago',
  },
};

export function getNewsSection() {
  return load('zebrold_news_section', NEWS_SECTION_DEFAULTS);
}
export function saveNewsSection(data) {
  save('zebrold_news_section', data);
}
export { NEWS_SECTION_DEFAULTS };

/* ══════════════════════════════════════════════════════
   ABOUT SCROLL SECTION
   ══════════════════════════════════════════════════════ */
const ABOUT_SCROLL_DEFAULTS = {
  text_de: 'WIR ARBEITEN MIT IHNEN, NICHT NUR FÜR SIE',
  text_en: 'WORKING WITH YOU, NOT JUST FOR YOU',
  imagePreview: null, // base64 or null for default asset
};

export function getAboutScroll() {
  return load('zebrold_about_scroll', ABOUT_SCROLL_DEFAULTS);
}
export function saveAboutScroll(data) {
  save('zebrold_about_scroll', data);
}
export { ABOUT_SCROLL_DEFAULTS };

/* ══════════════════════════════════════════════════════
   BOTTOM CTA SECTION
   ══════════════════════════════════════════════════════ */
const CTA_DEFAULTS = {
  caption_de: 'Kontakt',
  caption_en: 'Contact',
  h3_de: 'Bereit, die nächste Phase einzuleiten?',
  h3_en: 'Ready to begin the next phase?',
  bigText_de: 'Sprechen wir.',
  bigText_en: "Let's talk.",
  desc_de: 'Ob strategische Partnerschaft, Investitionsanfrage oder Projektkooperation — wir freuen uns auf Ihre Nachricht.',
  desc_en: 'Whether strategic partnership, investment inquiry, or project collaboration — we look forward to your message.',
  btnLabel_de: 'Kontakt aufnehmen',
  btnLabel_en: 'Get in Touch',
  btnUrl: '/contact',
  finePrint_de: 'Antwort innerhalb von 48 Stunden',
  finePrint_en: 'Response within 48 hours',
};

export function getCta() {
  return load('zebrold_cta_bottom', CTA_DEFAULTS);
}
export function saveCta(data) {
  save('zebrold_cta_bottom', data);
}
export { CTA_DEFAULTS };

/* ══════════════════════════════════════════════════════
   FAQ SECTION
   ══════════════════════════════════════════════════════ */
const FAQ_DEFAULTS = [
  {
    q_de: 'In welchen Sektoren ist Zebrold International Holdings Limited (Zebrold IHL) tätig?',
    q_en: 'Which sectors does Zebrold International Holdings Limited (Zebrold IHL) operate in?',
    a_de: 'Zebrold International Holdings Limited (Zebrold IHL) ist in zwölf strategischen Sektoren tätig, darunter EV-Laden & Batterien, Halbleiter, Automobilbau, Gesundheitswesen & Pharma, Finanzen & Investitionen, Technologie & IT, Bildung, Einzelhandel & Konsumgüter, Logistik & Lieferkette, Landwirtschaft & Lebensmittel, Industrie & Maschinenbau sowie Medien & Unterhaltung.',
    a_en: 'Zebrold International Holdings Limited (Zebrold IHL) operates across twelve strategic sectors, including EV Charging & Battery, Semiconductors, Car Manufacturing, Healthcare & Pharma, Finance & Investment, Technology & IT, Education, Retail & Consumer, Logistics & Supply Chain, Agriculture & Food, Industrial & Engineering, and Media & Entertainment.',
  },
  {
    q_de: 'Wie viele Tochtergesellschaften hat die Gruppe?',
    q_en: 'How many subsidiaries does the group manage?',
    a_de: 'Wir verwalten sechsundzwanzig marktführende Tochtergesellschaften auf drei Kontinenten. Jede Tochtergesellschaft agiert mit voller operativer Autonomie und profitiert gleichzeitig vom einheitlichen Kapitalrahmen und der institutionellen Governance-Struktur der Gruppe.',
    a_en: 'We manage twenty-six market-leading subsidiaries across three continents. Each subsidiary operates with full operational autonomy while benefiting from the group\'s unified capital framework.',
  },
  {
    q_de: 'Wo befindet sich der Hauptsitz von Zebrold International Holdings Limited (Zebrold IHL)?',
    q_en: 'Where is Zebrold International Holdings Limited (Zebrold IHL) headquartered?',
    a_de: 'Der Hauptsitz von Zebrold International Holdings Limited (Zebrold IHL) befindet sich an der Bockenheimer Landstrasse 17-19, 60325 Frankfurt am Main, Deutschland. Wir unterhalten operative Niederlassungen in Europa, Indien und Australien.',
    a_en: 'Zebrold International Holdings Limited (Zebrold IHL) is headquartered at Bockenheimer Landstrasse 17-19, 60325 Frankfurt am Main, Germany, with 26 regional offices spanning Europe, India, and Australia.',
  },
  {
    q_de: 'Was unterscheidet Zebrold von anderen Konglomeraten?',
    q_en: 'What sets Zebrold apart from other conglomerates?',
    a_de: 'Unser Unterscheidungsmerkmal ist die Kombination aus deutscher Ingenieurspräzision und globaler Ausführung. Jede Tochtergesellschaft profitiert von tiefgreifender Branchenexpertise, einer institutionellen Governance durch einen unabhängigen Aufsichtsrat und einem einheitlichen Kapitalrahmen, der den industriellen Wandel beschleunigt.',
    a_en: 'Our key differentiator is the combination of German precision engineering with global execution. Each portfolio company benefits from deep domain expertise and institutional governance.',
  },
  {
    q_de: 'Investiert Zebrold in Nachhaltigkeit?',
    q_en: 'Does Zebrold invest in sustainability?',
    a_de: 'Nachhaltigkeit ist der Kern unserer Strategie. Vom 1,5-GW-Portfolio für saubere Energie von Everstone Energy über die Batterien der nächsten Generation von Northvolt Power bis hin zur kohlenstoffneutralen Logistik von PrimeRoute treiben wir die emissionsfreie Transformation der globalen Infrastruktur aktiv voran.',
    a_en: 'Sustainability is at the core of our strategy. From Everstone Energy\'s 1.5 GW clean energy portfolio to Northvolt Power\'s next-gen batteries, we drive net-zero infrastructure transformation.',
  },
  {
    q_de: 'Wie kann ich mit der Zebrold Group zusammenarbeiten?',
    q_en: 'How can I partner with the Zebrold Group?',
    a_de: 'Wir begrüßen strategische Partnerschaften in allen zwölf Sektoren. Ob Sie nach Investitionspartnerschaften, Technologiekooperationen oder Supply-Chain-Integration suchen, unser Team bewertet Möglichkeiten durch einen strukturierten Bewertungsprozess. Kontaktieren Sie uns, um Ihr Projekt zu besprechen.',
    a_en: 'We welcome strategic partnerships across all twelve sectors. Contact our team to discuss investment, technology, or supply chain collaboration.',
  },
  {
    q_de: 'Wie sieht die Governance-Struktur der Gruppe aus?',
    q_en: 'How is the group governed?',
    a_de: 'Die Zebrold Group wird von einem unabhängigen Aufsichtsrat geleitet, der Finanzdisziplin und operative Autonomie für jede Tochtergesellschaft garantiert. Wir arbeiten mit institutioneller Strenge und legen Wert auf starke Cash-Generierung, Governance-Compliance und transparente Berichterstattung an die Stakeholder.',
    a_en: 'The Zebrold Group is governed by an independent supervisory board that ensures financial discipline and operational autonomy for each subsidiary.',
  },
  {
    q_de: 'Bietet Zebrold Karrieremöglichkeiten?',
    q_en: 'Does Zebrold offer career opportunities?',
    a_de: 'Ja. Mit sechsundzwanzig Tochtergesellschaften in zwölf Sektoren bieten wir vielfältige Karrierewege in den Bereichen Ingenieurwesen, Finanzen, Technologie, Gesundheitswesen, Bildung und mehr. Jede Tochtergesellschaft leitet ihre eigene Rekrutierung, während die Gruppe übergreifende Mobilitätsprogramme für Talente koordiniert.',
    a_en: 'Yes. With twenty-six subsidiaries across twelve sectors, we offer diverse career paths in engineering, finance, technology, healthcare, education, and more.',
  },
];

export function getFaq() {
  return load('zebrold_faq', FAQ_DEFAULTS);
}
export function saveFaq(data) {
  save('zebrold_faq', data);
}
export { FAQ_DEFAULTS };

/* ══════════════════════════════════════════════════════
   SECTION ORDER & VISIBILITY
   ══════════════════════════════════════════════════════ */
const SECTION_ORDER_DEFAULTS = [
  { id: 'hero', label: 'Hero Banner', visible: true },
  { id: 'ticker', label: 'Company Ticker', visible: true },
  { id: 'expertise', label: 'Expertise Cards', visible: true },
  { id: 'domains', label: 'Domains / Sectors', visible: true },
  { id: 'stats', label: 'Data & Statistics', visible: true },
  { id: 'news', label: 'In the News', visible: true },
  { id: 'about', label: 'About Scroll', visible: true },
  { id: 'cta', label: 'Bottom CTA', visible: true },
  { id: 'faq', label: 'FAQ', visible: true },
];

export function getSectionOrder() {
  return load('zebrold_section_order', SECTION_ORDER_DEFAULTS);
}
export function saveSectionOrder(data) {
  save('zebrold_section_order', data);
}
export { SECTION_ORDER_DEFAULTS };

/* ══════════════════════════════════════════════════════
   COMPANY TICKER / LOGOS SLIDER
   ══════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════
   WHAT WE DO (WE WHAT DO 4-COLUMN GRID)
   ══════════════════════════════════════════════════════ */
const WHAT_WE_DO_DEFAULTS = [
  {
    col: 1,
    title_en: 'INDUSTRIAL & MOBILITY',
    title_de: 'INDUSTRIE & MOBILITÄT',
    items: [
      { title_en: 'EV CHARGING & BATTERIES', title_de: 'EV-LADE- & BATTERIESYSTEME', path: '/sectors/ev-charging-battery' },
      { title_en: 'SEMICONDUCTOR MANUFACTURING', title_de: 'HALBLEITERFERTIGUNG', path: '/sectors/semiconductors' },
      { title_en: 'AUTOMOTIVE MANUFACTURING', title_de: 'AUTOMOBILBAU & FAHRZEUGE', path: '/sectors/car-manufacturing' },
      { title_en: 'PRECISION ENGINEERING', title_de: 'PRÄZISIONSTECHNIK', path: '/sectors/industrial-engineering' },
      { title_en: 'CLEAN ENERGY GRIDS', title_de: 'SAUBERE ENERGIEINFRASTRUKTUR', path: '/sectors/ev-charging-battery' },
    ],
  },
  {
    col: 2,
    title_en: 'HEALTHCARE & EDUCATION',
    title_de: 'GESUNDHEIT & BILDUNG',
    items: [
      { title_en: 'HEALTHCARE & PHARMA', title_de: 'GESUNDHEITSWESEN & PHARMA', path: '/sectors/healthcare-pharma' },
      { title_en: 'DIGITAL EDUCATION PLATFORMS', title_de: 'DIGITALE BILDUNGSPLATTFORMEN', path: '/sectors/education' },
      { title_en: 'MEDICAL TECHNOLOGY', title_de: 'MEDIZINTECHNIK & LIFE SCIENCES', path: '/sectors/healthcare-pharma' },
      { title_en: 'INSTITUTIONAL GOVERNANCE', title_de: 'INSTITUTIONELLE GOVERNANCE', path: '/sectors' },
      { title_en: 'HUMAN CAPITAL DEVELOPMENT', title_de: 'HUMANKAPITAL-ENTWICKLUNG', path: '/sectors/education' },
    ],
  },
  {
    col: 3,
    title_en: 'TECH, LOGISTICS & RETAIL',
    title_de: 'TECH, LOGISTIK & HANDEL',
    items: [
      { title_en: 'TECHNOLOGY & IT SYSTEMS', title_de: 'IT- & TECHNOLOGIESYSTEME', path: '/sectors/technology-it' },
      { title_en: 'LOGISTICS & SUPPLY CHAIN', title_de: 'LOGISTIK & LIEFERKETTE', path: '/sectors/logistics-supply-chain' },
      { title_en: 'RETAIL & CONSUMER GOODS', title_de: 'EINZELHANDEL & KONSUMGÜTER', path: '/sectors/retail-consumer' },
      { title_en: 'CLOUD & DIGITAL INFRASTRUCTURE', title_de: 'CLOUD- & DIGITALINFRASTRUKTUR', path: '/sectors/technology-it' },
      { title_en: 'GLOBAL DISTRIBUTION NETWORKS', title_de: 'GLOBALE VERTRIEBSNETZE', path: '/sectors/logistics-supply-chain' },
    ],
  },
  {
    col: 4,
    title_en: 'CAPITAL & STRATEGY',
    title_de: 'KAPITAL & STRATEGIE',
    items: [
      { title_en: 'INDUSTRIAL & HEAVY ENGINEERING', title_de: 'INDUSTRIE & MASCHINENBAU', path: '/sectors/industrial-engineering' },
      { title_en: 'FINANCIAL CAPITAL & INVESTMENTS', title_de: 'FINANZEN & INVESTITIONEN', path: '/sectors/finance-investment' },
      { title_en: 'MEDIA & ENTERTAINMENT', title_de: 'MEDIEN & UNTERHALTUNG', path: '/sectors/media-entertainment' },
      { title_en: 'ASSET ALLOCATION & M&A', title_de: 'KAPITALALLOKATION & M&A', path: '/sectors/finance-investment' },
      { title_en: 'STRATEGIC TRANSFORMATION', title_de: 'STRATEGISCHE TRANSFORMATION', path: '/sectors' },
    ],
  },
];

export function getWhatWeDo() {
  return load('zebrold_whatwedo', WHAT_WE_DO_DEFAULTS);
}
export function saveWhatWeDo(data) {
  save('zebrold_whatwedo', data);
}
export { WHAT_WE_DO_DEFAULTS };

/* ══════════════════════════════════════════════════════
   COMPANY TICKER DEFAULTS
   ══════════════════════════════════════════════════════ */
const TICKER_DEFAULTS = [
  { name: 'Country Health', country: 'Düsseldorf, Deutschland', sector: 'Gesundheitswesen & Pharma' },
  { name: 'Instructis', country: 'Hyderabad, Indien', sector: 'Bildung & Karriere' },
];

export function getTicker() {
  return load('zebrold_ticker', TICKER_DEFAULTS);
}
export function saveTicker(data) {
  save('zebrold_ticker', data);
}
export { TICKER_DEFAULTS };



