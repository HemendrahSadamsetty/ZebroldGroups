import evSectorImg from '../assets/ev_sector.png';
import semiSectorImg from '../assets/semi_sector.jpg';
import carSectorImg from '../assets/car_sector.png';
import retailSectorImg from '../assets/retail_sector.png';
import educationSectorImg from '../assets/education_sector.png';
import techSectorImg from '../assets/tech_sector.png';
import financeSectorImg from '../assets/finance_sector.png';
import healthcareSectorImg from '../assets/healthcare_sector.png';
import logisticsSectorImg from '../assets/logistics_sector.png';
import agricultureSectorImg from '../assets/agriculture_sector.png';
import industrialSectorImg from '../assets/industrial_sector.png';
import mediaSectorImg from '../assets/media_sector.png';

export const sectorDetailsData = {
  'ev-charging-battery': {
    image: evSectorImg,
    tagline: 'Powering the Next-Generation Clean Mobility Infrastructure',
    overview: 'Zebrold Group leads the global transition to net-zero transportation through Everstone Energy and Northvolt Power. Our integrated battery systems and ultra-fast charging networks power over 150,000 electric vehicles daily across Europe and Asia.',
    stats: [
      { label: 'Installed Charging Hubs', value: '14,200+' },
      { label: 'Annual Energy Delivered', value: '2.4 GWh' },
      { label: 'CO2 Offset Annually', value: '1.8M Tons' },
    ],
    innovations: [
      { title: '800V Ultra-Fast Liquid-Cooled Architecture', desc: 'Capable of delivering 350kW continuous output, adding 200km range in under 8 minutes.' },
      { title: 'Solid-State Battery Cell Integration', desc: 'Next-gen energy density reaching 450 Wh/kg with zero thermal runaway risks.' },
      { title: 'Grid-Supportive BESS Units', desc: 'Distributed battery storage buffering peak demand spikes without local grid upgrades.' }
    ],
    mission: 'To build resilient energy storage and charge distribution systems that make electric mobility reliable, accessible, and 100% powered by renewable energy.'
  },
  'semiconductors': {
    image: semiSectorImg,
    tagline: 'Precision Silicon Engineering for Autonomous Systems & AI',
    overview: 'Through Meridian Microelectronics and Silicon Crest Technologies, Zebrold operates state-of-the-art 300mm wafer fabrication facilities specializing in automotive-grade power semiconductors, microcontrollers, and edge AI processing chips.',
    stats: [
      { label: 'Wafer Fab Capacity', value: '85k/Month' },
      { label: 'Global Patents Held', value: '1,420+' },
      { label: 'Defect Rate', value: '< 0.01 PPM' },
    ],
    innovations: [
      { title: 'Gallium Nitride (GaN) Power Devices', desc: '99.2% power conversion efficiency for automotive inverters and high-density power supply units.' },
      { title: 'Edge AI Neural Accelerators', desc: 'Ultra-low-power silicon delivering 40 TOPS for real-time sensor fusion in autonomous vehicles.' },
      { title: 'Sub-5nm Packaging & Chiplet Integration', desc: 'Advanced 3D stacking technology reducing die footprint by 40%.' }
    ],
    mission: 'Delivering uncompromised semiconductor reliability and high-efficiency power electronics to fuel modern industrial automation and intelligent hardware.'
  },
  'car-manufacturing': {
    image: carSectorImg,
    tagline: 'Engineering Modular Vehicles for Urban & Industrial Logistics',
    overview: 'Redford Automotive and Westbridge Motors manufacture heavy-duty commercial EVs, specialized urban delivery shuttles, and luxury passenger vehicles built on Zebrold’s proprietary lightweight aluminum chassis platform.',
    stats: [
      { label: 'Annual Production Capacity', value: '120,000' },
      { label: 'Global Assembly Fabs', value: '4 Plants' },
      { label: 'Fleet Uptime Guarantee', value: '99.4%' },
    ],
    innovations: [
      { title: 'Modular Skateboard EV Architecture', desc: 'Unified battery-chassis module compatible with delivery vans, utility trucks, and passenger shuttles.' },
      { title: 'Robotic Weld & Stamping Automation', desc: 'Fully automated body shops driven by computer vision quality assurance.' },
      { title: 'OTA Connected Fleet Management', desc: 'Telematics engine predicting maintenance needs 500 operating hours in advance.' }
    ],
    mission: 'Pioneering clean, durable, and highly efficient transport vehicles built for global supply fleets and sustainable transit.'
  },
  'retail-consumer': {
    image: retailSectorImg,
    tagline: 'Omnichannel Retail & Intelligent Consumer Supply Networks',
    overview: 'PrimeMart Retail and UrbanBasket Stores operate over 1,800 smart retail outlets and automated fulfillment nodes, combining AI demand forecasting with hyper-local delivery pipelines across major metro centers.',
    stats: [
      { label: 'Active Retail Outlets', value: '1,850+' },
      { label: 'Daily Customer Transactions', value: '3.2M' },
      { label: 'Same-Day Delivery Coverage', value: '88%' },
    ],
    innovations: [
      { title: 'Zero-Checkout Micro-Fulfillment', desc: 'Computer vision and weight sensors enabling seamless grab-and-go store experiences.' },
      { title: 'Predictive Demand Engine', desc: 'Machine learning algorithms reducing perishable fresh food waste by 65%.' },
      { title: 'Unified Loyalty & Digital Payment Platform', desc: 'Integrated financial checkout processing millions of transactions daily.' }
    ],
    mission: 'Transforming neighborhood commerce through technology-driven retail hubs that deliver fresh, sustainable products directly to consumers.'
  },
  'education': {
    image: educationSectorImg,
    tagline: 'Empowering Future Leaders & Technical Specialists Globally',
    overview: 'Brighton Education Group, Clearpath Learning, and Instructis Career deliver accredited technical diplomas, corporate reskilling programs, and digital learning platforms serving over 450,000 active students across 30 countries.',
    stats: [
      { label: 'Active Enrolled Students', value: '450,000+' },
      { label: 'Industry Placement Rate', value: '94.2%' },
      { label: 'Corporate Partners', value: '620+' },
    ],
    innovations: [
      { title: 'AI-Guided Adaptive Curriculum', desc: 'Personalized learning pathways optimizing retention and technical skill mastery.' },
      { title: 'VR Industrial Simulation Labs', desc: 'Immersive virtual environments for training semiconductor technicians and EV engineers.' },
      { title: 'Global Skill Certification Ledger', desc: 'Blockchain-verified credentials ensuring global portability of degrees and certifications.' }
    ],
    mission: 'Bridging the global skills gap by providing world-class technical education, industry-integrated apprenticeships, and lifelong career growth platforms.'
  },
  'technology-it': {
    image: techSectorImg,
    tagline: 'Enterprise Cloud Infrastructure, Cyber Resilience & AI Systems',
    overview: 'Skybridge Technologies and Arden Digital Solutions build resilient enterprise software, cloud infrastructure platforms, and zero-trust cybersecurity architectures for Fortune 500 enterprises and defense agencies.',
    stats: [
      { label: 'Cloud Data Under Management', value: '42 PB' },
      { label: 'Enterprise Customers', value: '1,250+' },
      { label: 'System Uptime SLA', value: '99.999%' },
    ],
    innovations: [
      { title: 'Quantum-Resistant Encryption Core', desc: 'Post-quantum cryptographic algorithms protecting critical enterprise data assets.' },
      { title: 'Automated Cloud FinOps Engine', desc: 'Real-time compute optimization cutting enterprise infrastructure costs by up to 35%.' },
      { title: 'Autonomous Threat Detection Mesh', desc: 'Real-time AI telemetry mitigating cyber threats within 50 milliseconds.' }
    ],
    mission: 'Building secure, scalable, and resilient digital infrastructure that powers global industries and critical digital ecosystems.'
  },
  'finance-investment': {
    image: financeSectorImg,
    tagline: 'Strategic Capital Deployment & Institutional Asset Growth',
    overview: 'Sterling Financial Services and Harrington Capital Group manage €2.65 Billion in assets across infrastructure equity, industrial debt, and venture capital, driving high-yield capital deployment into sustainable industrial projects.',
    stats: [
      { label: 'Assets Under Management', value: '€2.65B' },
      { label: 'IRR Portfolio Average', value: '18.4%' },
      { label: 'Institutional Investors', value: '140+' },
    ],
    innovations: [
      { title: 'Algorithmic Risk Underwriting', desc: 'Proprietary financial models assessing capital risk for complex industrial infrastructure investments.' },
      { title: 'Green Infrastructure Finance Bonds', desc: 'Institutional debt instruments dedicated strictly to net-zero energy and transit initiatives.' },
      { title: 'Real-Time Portfolio Risk Analytics', desc: 'Automated treasury dashboard tracking cross-asset exposure dynamically.' }
    ],
    mission: 'Deploying institutional capital with discipline, precision, and long-term vision to fund tomorrow’s core industrial backbone.'
  },
  'healthcare-pharma': {
    image: healthcareSectorImg,
    tagline: 'Precision Biopharmaceuticals & Advanced Medical Equipment',
    overview: 'Oakwell Healthcare and Greenford Pharmaceuticals produce life-saving therapeutic biologics, diagnostic imaging devices, and automated clinical hospital equipment serving healthcare networks across 45 nations.',
    stats: [
      { label: 'Patients Reached Annually', value: '12.5M+' },
      { label: 'Clinical Trials Active', value: '28' },
      { label: 'GMP Certified Facilities', value: '6' },
    ],
    innovations: [
      { title: 'Targeted Messenger RNA Therapeutics', desc: 'Advanced delivery platforms for oncology and autoimmune disease management.' },
      { title: 'AI-Powered Diagnostic Imaging', desc: 'Computer vision scanners identifying early-stage cardiac anomalies with 99.1% accuracy.' },
      { title: 'Cold-Chain Biologics Distribution', desc: 'Automated temperature-controlled logistics ensuring 100% potency during transit.' }
    ],
    mission: 'Advancing human longevity and medical accessibility through cutting-edge biopharmaceutical research and hospital technologies.'
  },
  'logistics-supply-chain': {
    image: logisticsSectorImg,
    tagline: 'Autonomous Freight Freight, Warehousing & Global Cold-Chain',
    overview: 'PrimeRoute Logistics and GlobalLink Supply Chain operate 4.5 million square meters of automated distribution space, container terminals, and intermodal transport fleets connecting Europe, Asia, and the Americas.',
    stats: [
      { label: 'Annual Tonnage Moved', value: '4.8M Tons' },
      { label: 'Automated Hubs', value: '34' },
      { label: 'Fleet Carbon Reduction', value: '42%' },
    ],
    innovations: [
      { title: 'Autonomous Robotic Warehousing', desc: 'AGV sorting fleets capable of processing 120,000 packages per hour per facility.' },
      { title: 'Predictive Freight Routing Engine', desc: 'Dynamic AI dispatch optimizing fuel consumption and transit speeds across sea and rail routes.' },
      { title: 'IoT Cargo Telematics', desc: 'Continuous environmental and security tracking for high-value pharmaceutical and electronic shipments.' }
    ],
    mission: 'Architecting seamless, low-emission supply chains that keep international trade moving smoothly and reliably.'
  },
  'agriculture-food': {
    image: agricultureSectorImg,
    tagline: 'Sustainable Agri-Tech, Precision Farming & Organic Processing',
    overview: 'Greenfield Agri and Harvest Hill Foods manage 85,000 hectares of precision farmland, indoor vertical hydroponic farms, and automated food processing facilities delivering nutritious, sustainable food products globally.',
    stats: [
      { label: 'Farmland Under Management', value: '85,000 Ha' },
      { label: 'Water Usage Efficiency', value: '+75%' },
      { label: 'Annual Crop Output', value: '620,000 Tons' },
    ],
    innovations: [
      { title: 'Drone-Assisted Precision Agronomy', desc: 'Hyperspectral soil mapping applying targeted bio-nutrients only where needed.' },
      { title: 'Closed-Loop Hydroponic Towers', desc: 'Vertical farming systems consuming 95% less water than traditional soil farming.' },
      { title: 'Bio-Based Packaging Material', desc: '100% compostable food packaging derived from organic agricultural waste.' }
    ],
    mission: 'Ensuring global food security through water-efficient precision agriculture and transparent farm-to-table food supply chains.'
  },
  'industrial-engineering': {
    image: industrialSectorImg,
    tagline: 'Heavy Machine Manufacturing, Metallurgy & Smart Infrastructure',
    overview: 'Ironclad Engineering, Stonebridge Industries, and Stonecraft Interiors design and fabricate heavy industrial machinery, precision structural steel, and high-performance architectural systems for global construction.',
    stats: [
      { label: 'Steel Fabricated Annually', value: '450k Tons' },
      { label: 'Industrial Projects Built', value: '850+' },
      { label: 'Safety Record (LTIFR)', value: '< 0.05' },
    ],
    innovations: [
      { title: 'Low-Carbon Green Steel Alloys', desc: 'Hydrogen-smelted structural steel reducing embodied carbon by 75% per ton.' },
      { title: 'Modular Prefabricated Bridges & Structures', desc: 'Precision engineered modules enabling 4x faster on-site assembly for civil infrastructure.' },
      { title: 'Smart Industrial Hydraulics', desc: 'IoT-enabled heavy actuators with integrated pressure diagnostics preventing mechanical downtime.' }
    ],
    mission: 'Building robust, durable industrial equipment and structural engineering solutions that underpin modern civil civilization.'
  },
  'media-entertainment': {
    image: mediaSectorImg,
    tagline: 'Next-Generation Content Studio, Digital Streaming & Broadcasting',
    overview: 'Northstar Entertainment and Silverline Studios produce award-winning feature films, original series, broadcast news channels, and immersive digital gaming experiences reaching over 80 million global viewers.',
    stats: [
      { label: 'Global Viewers Reached', value: '80M+' },
      { label: 'Original IP Holdings', value: '420 Titles' },
      { label: 'Industry Awards Won', value: '68' },
    ],
    innovations: [
      { title: 'Virtual Production LED Stages', desc: 'Real-time Unreal Engine environment projection eliminating physical location travel requirements.' },
      { title: 'AI-Assisted Automated Dubbing & Localization', desc: 'Neural voice synthesis producing authentic multi-language dubs in under 24 hours.' },
      { title: 'Interactive Spatial Media Engines', desc: 'Immersive AR/VR storytelling platforms for next-generation digital entertainment.' }
    ],
    mission: 'Inspiring global audiences through powerful storytelling, innovative broadcast technology, and high-impact digital content.'
  }
};
