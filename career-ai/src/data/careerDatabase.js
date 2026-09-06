/**
 * Comprehensive Career Database mapped to the 14 assessment categories:
 * SW, AI, CY, UX, EE, BM, FIN, MKT, HC, EDU, RES, LAW, MED, GOV
 */

export const CATEGORY_INFO = {
  SW: { code: 'SW', name: 'Software / IT', field: 'Technology', color: 'blue', maxScore: 56 },
  AI: { code: 'AI', name: 'AI & Data Science', field: 'AI & Analytics', color: 'purple', maxScore: 43 },
  CY: { code: 'CY', name: 'Cybersecurity', field: 'Cybersecurity', color: 'red', maxScore: 30 },
  UX: { code: 'UX', name: 'UI/UX & Design', field: 'Design', color: 'pink', maxScore: 45 },
  EE: { code: 'EE', name: 'Electronics / Engineering', field: 'Engineering', color: 'amber', maxScore: 28 },
  BM: { code: 'BM', name: 'Business & Management', field: 'Business', color: 'emerald', maxScore: 51 },
  FIN: { code: 'FIN', name: 'Finance', field: 'Finance', color: 'cyan', maxScore: 39 },
  MKT: { code: 'MKT', name: 'Marketing', field: 'Marketing', color: 'orange', maxScore: 23 },
  HC: { code: 'HC', name: 'Healthcare', field: 'Healthcare', color: 'rose', maxScore: 48 },
  EDU: { code: 'EDU', name: 'Education', field: 'Education', color: 'indigo', maxScore: 38 },
  RES: { code: 'RES', name: 'Research', field: 'Research & Science', color: 'teal', maxScore: 34 },
  LAW: { code: 'LAW', name: 'Law', field: 'Legal', color: 'slate', maxScore: 38 },
  MED: { code: 'MED', name: 'Media / Content / Creative', field: 'Media & Creative', color: 'violet', maxScore: 47 },
  GOV: { code: 'GOV', name: 'Government / Public Service', field: 'Government & Public Service', color: 'green', maxScore: 35 },
};

export const CAREER_DATABASE = [
  // ==================== 1. SOFTWARE / IT (SW) ====================
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    primaryCategory: 'SW',
    secondaryCategories: ['UX', 'MED'],
    field: 'Technology',
    salaryRange: '₹4.5 – 12 LPA',
    growth: 'High Demand',
    icon: 'Code2',
    overview: 'Build interactive, responsive web applications that users touch and see daily using modern web technologies.',
    requiredSkills: [
      { name: 'HTML5/CSS3/Tailwind', level: 90 },
      { name: 'JavaScript & TypeScript', level: 85 },
      { name: 'React / Next.js', level: 80 },
      { name: 'Responsive Web Design', level: 85 },
      { name: 'Git & Version Control', level: 75 }
    ],
    strengths: ['Visual thinking', 'Attention to interface detail', 'Rapid feedback loop focus', 'Structured coding'],
    skillGaps: ['State management at scale', 'Frontend performance optimization', 'Accessibility (a11y)'],
    recommendedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'REST APIs'],
    dailyLife: [
      'Translating design wireframes into clean, reactive user interfaces',
      'Integrating RESTful and GraphQL APIs with frontend components',
      'Optimizing rendering performance and mobile responsiveness',
      'Collaborating in agile sprints with UX designers and backend engineers'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 6 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6 – 10 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹10 – 18 LPA' },
      { level: 'Senior (5+ yr)', range: '₹18 – 32+ LPA' }
    ],
    pros: ['Immediate visual gratification from code', 'Abundant remote and hybrid opportunities', 'Strong freelance potential'],
    cons: ['Rapid framework churn requires continuous learning', 'Cross-browser testing can be tedious'],
    dayInLife: 'Morning stand-up with the dev team, coding an interactive analytics dashboard in React, lunch, pairing with UX to review animations, and running Lighthouse audits before deployment.'
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    primaryCategory: 'SW',
    secondaryCategories: ['CY', 'AI'],
    field: 'Technology',
    salaryRange: '₹5 – 14 LPA',
    growth: 'High Demand',
    icon: 'Server',
    overview: 'Architect reliable backend services, APIs, and databases that handle heavy traffic, data persistence, and security.',
    requiredSkills: [
      { name: 'Node.js / Python / Java', level: 85 },
      { name: 'SQL & Database Architecture', level: 80 },
      { name: 'REST & GraphQL API Design', level: 85 },
      { name: 'Authentication & Security', level: 75 },
      { name: 'Cloud & Docker', level: 70 }
    ],
    strengths: ['Logical reasoning', 'Systematic problem solving', 'Data-flow comprehension', 'Performance focus'],
    skillGaps: ['Microservices architecture', 'Distributed caching (Redis)', 'Database query optimization'],
    recommendedSkills: ['Node.js/Express', 'PostgreSQL', 'Docker', 'Redis', 'System Design'],
    dailyLife: [
      'Writing secure server-side logic and database schemas',
      'Optimizing complex SQL queries and API response latencies',
      'Building authentication, authorization, and payment pipelines',
      'Writing unit and integration test suites'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹4 – 7 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹7 – 12 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹12 – 22 LPA' },
      { level: 'Senior (5+ yr)', range: '₹22 – 40+ LPA' }
    ],
    pros: ['Foundational role across all tech companies', 'Deep technical problem solving', 'High compensation ceilings'],
    cons: ['On-call rotations for critical production outages', 'Hidden complexity in distributed systems'],
    dayInLife: 'Designing database models for a new feature, writing unit tests, reviewing pull requests, and tuning database indexes to speed up slow queries.'
  },
  {
    id: 'full-stack-developer',
    title: 'Full Stack Developer',
    primaryCategory: 'SW',
    secondaryCategories: ['UX', 'BM'],
    field: 'Technology',
    salaryRange: '₹5.5 – 15 LPA',
    growth: 'High Demand',
    icon: 'Layers',
    overview: 'End-to-end software creator capable of building both seamless client experiences and scalable backend architectures.',
    requiredSkills: [
      { name: 'Frontend (React/Vue)', level: 85 },
      { name: 'Backend (Node/Python)', level: 85 },
      { name: 'Databases (SQL/NoSQL)', level: 80 },
      { name: 'DevOps & Deployment', level: 70 },
      { name: 'API Integration', level: 85 }
    ],
    strengths: ['Holistic system perspective', 'Rapid prototyping agility', 'Cross-layer troubleshooting', 'Versatility'],
    skillGaps: ['Cloud infrastructure orchestration', 'Advanced state management', 'Security hardening'],
    recommendedSkills: ['Next.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Prisma ORM'],
    dailyLife: [
      'Shipping end-to-end features from UI buttons to database tables',
      'Connecting frontend state with asynchronous backend endpoints',
      'Deploying continuous integration pipelines on cloud platforms',
      'Maintaining API documentation and client SDKs'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹4 – 7.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹7.5 – 14 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹14 – 24 LPA' },
      { level: 'Senior (5+ yr)', range: '₹24 – 45+ LPA' }
    ],
    pros: ['Massive startup demand', 'Ability to build entire products solo', 'Versatile career progression'],
    cons: ['Broad context switching across frontend and backend stacks', 'Need to keep up with two vast ecosystems'],
    dayInLife: 'Building a new user onboarding flow in Next.js in the morning, writing the Stripe webhook handler in Node in the afternoon, and pushing to staging.'
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    primaryCategory: 'SW',
    secondaryCategories: ['EE', 'RES'],
    field: 'Technology',
    salaryRange: '₹6 – 16 LPA',
    growth: 'High Demand',
    icon: 'Cpu',
    overview: 'Apply engineering principles and data structures to build robust, maintainable, and large-scale software systems.',
    requiredSkills: [
      { name: 'Data Structures & Algorithms', level: 85 },
      { name: 'Core Language (Java/C++/Go)', level: 85 },
      { name: 'Object-Oriented & Functional Design', level: 80 },
      { name: 'System Design Fundamentals', level: 75 },
      { name: 'Automated Testing & CI/CD', level: 75 }
    ],
    strengths: ['Algorithmic thinking', 'Mathematical rigor', 'System architecture', 'Debugging complexity'],
    skillGaps: ['Large-scale distributed systems', 'Concurrency & multithreading', 'Low-latency profiling'],
    recommendedSkills: ['Java/Go', 'Data Structures & Algorithms', 'System Design', 'PostgreSQL', 'Git'],
    dailyLife: [
      'Implementing high-throughput core service logic',
      'Benchmarking algorithmic complexity and memory footprints',
      'Collaborating on architectural design RFCs',
      'Maintaining test coverage and code reliability standards'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹5 – 9 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹9 – 16 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹16 – 28 LPA' },
      { level: 'Senior (5+ yr)', range: '₹28 – 50+ LPA' }
    ],
    pros: ['Highest global mobility and tier-1 tech recruiting', 'Deep technical respect', 'Long-term foundational skills'],
    cons: ['Rigorous multi-round coding interviews', 'Can be removed from visual end-user feedback'],
    dayInLife: 'Solving complex race conditions in a message broker, designing clean class hierarchies, and reviewing PRs for algorithmic efficiency.'
  },
  {
    id: 'mobile-app-developer',
    title: 'Mobile App Developer',
    primaryCategory: 'SW',
    secondaryCategories: ['UX', 'MED'],
    field: 'Technology',
    salaryRange: '₹4.5 – 13 LPA',
    growth: 'High Demand',
    icon: 'Smartphone',
    overview: 'Develop polished, high-performance mobile applications for Android and iOS using Flutter, React Native, or Native SDKs.',
    requiredSkills: [
      { name: 'Flutter / React Native', level: 85 },
      { name: 'Mobile UI/UX Conventions', level: 80 },
      { name: 'State Management (Riverpod/Redux)', level: 80 },
      { name: 'Offline Storage & SQLite', level: 75 },
      { name: 'App Store / Play Store Release', level: 70 }
    ],
    strengths: ['Mobile-first design sense', 'Device hardware integration curiosity', 'Smooth animation craftsmanship'],
    skillGaps: ['Native iOS (Swift) / Android (Kotlin) bridge writing', 'Push notification pipelines', 'App memory profiling'],
    recommendedSkills: ['Flutter/Dart', 'React Native', 'Firebase', 'State Management', 'Mobile UI Design'],
    dailyLife: [
      'Building smooth touch-responsive mobile layouts and animations',
      'Implementing offline-first data synchronization and local caching',
      'Testing on physical device farms across multiple screen sizes',
      'Managing Play Store & App Store deployments and compliance'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 6.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6.5 – 11 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹11 – 20 LPA' },
      { level: 'Senior (5+ yr)', range: '₹20 – 35+ LPA' }
    ],
    pros: ['See your apps directly on millions of physical phones', 'High consumer impact', 'Strong freelance & indie hacking culture'],
    cons: ['Device fragmentation testing', 'Strict App Store review turnaround cycles'],
    dayInLife: 'Refining swipe gestures and micro-interactions in Flutter, wiring camera hardware access, and building an offline draft storage mechanism.'
  },
  

  // ==================== 2. AI & DATA SCIENCE (AI) ====================
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    primaryCategory: 'AI',
    secondaryCategories: ['FIN', 'BM'],
    field: 'AI & Analytics',
    salaryRange: '₹4 – 10 LPA',
    growth: 'High Demand',
    icon: 'BarChart3',
    overview: 'Extract, clean, and visualize data to deliver clear business insights, trends, and decision-making dashboards.',
    requiredSkills: [
      { name: 'SQL & Database Querying', level: 85 },
      { name: 'Excel & Advanced Spreadsheets', level: 90 },
      { name: 'Power BI / Tableau', level: 80 },
      { name: 'Python (Pandas, Matplotlib)', level: 70 },
      { name: 'Statistical Interpretation', level: 75 }
    ],
    strengths: ['Pattern detection', 'Structured quantitative analysis', 'Clear storytelling with charts', 'Business curiosity'],
    skillGaps: ['Automated ETL pipelines', 'Predictive modeling', 'A/B testing statistical rigor'],
    recommendedSkills: ['SQL', 'Power BI / Tableau', 'Python Pandas', 'Business Statistics', 'Excel Formulas'],
    dailyLife: [
      'Writing SQL queries to extract metrics across millions of records',
      'Building executive dashboards in Tableau and Power BI',
      'Investigating sudden metric drops or user behavior anomalies',
      'Presenting analytical findings to non-technical stakeholders'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9 – 16 LPA' },
      { level: 'Senior (5+ yr)', range: '₹16 – 28+ LPA' }
    ],
    pros: ['Accessible entry point into data careers', 'Direct visibility to executive leadership', 'Applicable across every single industry'],
    cons: ['Cleaning messy raw data consumes large chunks of time', 'Demands repetitive ad-hoc reporting requests'],
    dayInLife: 'Connecting to the company warehouse in SQL, generating a weekly sales cohort analysis, and creating an interactive dashboard for the product team.'
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    primaryCategory: 'AI',
    secondaryCategories: ['RES', 'SW'],
    field: 'AI & Analytics',
    salaryRange: '₹6 – 16 LPA',
    growth: 'High Demand',
    icon: 'BrainCircuit',
    overview: 'Develop predictive models, machine learning algorithms, and statistical experiments to solve complex business puzzles.',
    requiredSkills: [
      { name: 'Python & Scientific Stack (Pandas/Scikit-learn)', level: 90 },
      { name: 'Applied Statistics & Probability', level: 85 },
      { name: 'Machine Learning Algorithms', level: 80 },
      { name: 'Data Visualization & Storytelling', level: 75 },
      { name: 'SQL & Big Data Tools', level: 75 }
    ],
    strengths: ['Investigative curiosity', 'Mathematical modeling', 'Hypothesis-driven experimentation', 'Translating math into value'],
    skillGaps: ['Production model deployment (MLOps)', 'Feature store management', 'Deep learning architectures'],
    recommendedSkills: ['Scikit-Learn', 'Feature Engineering', 'Hypothesis Testing', 'Python Pandas', 'SQL'],
    dailyLife: [
      'Formulating hypotheses and testing them against real customer data',
      'Training regression, classification, and clustering models',
      'Evaluating precision, recall, and ROC curves against business benchmarks',
      'Writing research notebooks and executive presentations'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹5 – 8.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹8.5 – 15 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹15 – 26 LPA' },
      { level: 'Senior (5+ yr)', range: '₹26 – 45+ LPA' }
    ],
    pros: ['High intellectual satisfaction', 'Prestigious high-growth domain', 'Huge influence on product strategy'],
    cons: ['Projects can be exploratory with uncertain business outcomes', 'Requires continuous statistical upskilling'],
    dayInLife: 'Cleaning transaction datasets, engineering customer churn features, training an XGBoost classifier, and analyzing feature importances.'
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    primaryCategory: 'AI',
    secondaryCategories: ['SW', 'RES'],
    field: 'AI & Analytics',
    salaryRange: '₹7 – 18 LPA',
    growth: 'Rapidly Growing',
    icon: 'Sparkles',
    overview: 'Build, integrate, and deploy Generative AI, Large Language Models (LLMs), and autonomous agentic workflows into production apps.',
    requiredSkills: [
      { name: 'LLMs & Prompt Engineering', level: 90 },
      { name: 'Python & FastAPI', level: 85 },
      { name: 'Vector Databases & RAG Pipelines', level: 80 },
      { name: 'Model Fine-tuning & Embeddings', level: 75 },
      { name: 'LangChain / LlamaIndex / Agent Frameworks', level: 80 }
    ],
    strengths: ['Rapid technical adaptation', 'Intuitive understanding of AI behavior', 'System integration creativity', 'Cutting-edge hunger'],
    skillGaps: ['Evaluation metrics for generative outputs', 'Cost and token latency optimization', 'Agent guardrails & security'],
    recommendedSkills: ['LangChain/LlamaIndex', 'Vector Databases (Pinecone/Chroma)', 'OpenAI/Gemini APIs', 'FastAPI', 'RAG Architectures'],
    dailyLife: [
      'Architecting Retrieval-Augmented Generation (RAG) knowledge pipelines',
      'Designing structured prompt chains and autonomous tool-calling agents',
      'Benchmarking hallucination rates and response accuracy',
      'Integrating model inference endpoints into web services'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹6 – 10 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹10 – 18 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹18 – 30 LPA' },
      { level: 'Senior (5+ yr)', range: '₹30 – 55+ LPA' }
    ],
    pros: ['Fastest-growing tech discipline in the world', 'Cutting-edge innovation everyday', 'Massive compensation and startup valuation'],
    cons: ['Rapidly moving target where frameworks become obsolete in months', 'Model non-determinism adds debugging complexity'],
    dayInLife: 'Building a RAG vector search pipeline with Gemini embeddings, optimizing prompt latency, and writing automated test evaluations for LLM output accuracy.'
  },
  {
    id: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    primaryCategory: 'AI',
    secondaryCategories: ['SW', 'EE'],
    field: 'AI & Analytics',
    salaryRange: '₹7 – 18 LPA',
    growth: 'Rapidly Growing',
    icon: 'Network',
    overview: 'Bridge machine learning models and software infrastructure by deploying, monitoring, and scaling automated ML pipelines in production.',
    requiredSkills: [
      { name: 'PyTorch / TensorFlow', level: 85 },
      { name: 'MLOps & CI/CD for Models (MLflow/Kubeflow)', level: 80 },
      { name: 'Docker & Kubernetes', level: 75 },
      { name: 'High-Performance Python / C++', level: 80 },
      { name: 'Data Pipeline Engineering', level: 75 }
    ],
    strengths: ['Software craftsmanship meets statistical models', 'Optimization mindset', 'Scale and throughput focus'],
    skillGaps: ['Distributed model training over GPU clusters', 'Model quantization & edge inference', 'Real-time drift detection'],
    recommendedSkills: ['PyTorch', 'MLOps Tools (MLflow/DVC)', 'Docker & Kubernetes', 'FastAPI', 'Cloud GPU instances (AWS/GCP)'],
    dailyLife: [
      'Containerizing ML training and inference microservices',
      'Automating model retraining pipelines upon data drift detection',
      'Quantizing deep neural networks for sub-50ms inference latency',
      'Managing GPU compute clusters and deployment workloads'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹6 – 10 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹10 – 18 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹18 – 32 LPA' },
      { level: 'Senior (5+ yr)', range: '₹32 – 55+ LPA' }
    ],
    pros: ['Critical backbone role in all AI-first companies', 'Blends software engineering rigor with AI innovation', 'High barrier to entry equals strong job security'],
    cons: ['Infrastructure debugging can be complex', 'High GPU cloud compute costs create operational pressures'],
    dayInLife: 'Setting up an automated Kubeflow training pipeline, converting PyTorch weights to ONNX for fast inference, and monitoring production model latency metrics.'
  },

  // ==================== 3. CYBERSECURITY (CY) ====================
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    primaryCategory: 'CY',
    secondaryCategories: ['SW', 'LAW'],
    field: 'Cybersecurity',
    salaryRange: '₹4.5 – 12 LPA',
    growth: 'High Demand',
    icon: 'ShieldCheck',
    overview: 'Monitor network traffic, investigate security incidents, identify vulnerabilities, and protect critical systems from cyber threats.',
    requiredSkills: [
      { name: 'Network Protocols & TCP/IP', level: 85 },
      { name: 'SIEM Tools (Splunk, QRadar)', level: 80 },
      { name: 'Vulnerability Scanning', level: 75 },
      { name: 'Linux / Command Line Security', level: 80 },
      { name: 'Incident Response Protocols', level: 75 }
    ],
    strengths: ['Investigative vigilance', 'Attention to anomalous patterns', 'Calm under incident pressure', 'Defensive mindset'],
    skillGaps: ['Packet inspection depth (Wireshark)', 'Threat intelligence integration', 'Automated containment scripting'],
    recommendedSkills: ['CompTIA Security+ / CEH', 'Wireshark & Linux', 'SIEM Tools (Splunk)', 'Network Security Fundamentals', 'Python Scripting'],
    dailyLife: [
      'Analyzing real-time SIEM alerts and firewall anomaly logs',
      'Investigating suspicious phishing attempts and endpoint malware flags',
      'Conducting regular vulnerability scans across server clusters',
      'Drafting incident containment post-mortems and mitigation plans'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 6 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6 – 10 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹10 – 18 LPA' },
      { level: 'Senior (5+ yr)', range: '₹18 – 30+ LPA' }
    ],
    pros: ['Zero unemployment rate globally', 'Crucial mission protecting human data and infrastructure', 'Clear certification roadmaps'],
    cons: ['Alert fatigue from high volume of automated notifications', 'Shift-based coverage in 24/7 SOC centers'],
    dayInLife: 'Triaging endpoint detection alerts in Splunk, isolating an infected workstation, analyzing suspicious network beaconing, and writing a mitigation brief.'
  },
  {
    id: 'soc-analyst',
    title: 'SOC Analyst',
    primaryCategory: 'CY',
    secondaryCategories: ['GOV', 'SW'],
    field: 'Cybersecurity',
    salaryRange: '₹4 – 11 LPA',
    growth: 'High Demand',
    icon: 'Eye',
    overview: 'Serve on the frontline of a Security Operations Center (SOC), providing 24/7 continuous threat monitoring and rapid triage.',
    requiredSkills: [
      { name: 'SIEM & Log Analysis', level: 85 },
      { name: 'Endpoint Detection & Response (EDR)', level: 80 },
      { name: 'Threat Triage & Escalation', level: 85 },
      { name: 'Basic Malware Analysis', level: 70 },
      { name: 'Network Traffic Analysis', level: 75 }
    ],
    strengths: ['Rapid alert assessment', 'Methodical investigation checklist adherence', 'Composure during active incidents'],
    skillGaps: ['Advanced digital forensics', 'Reverse engineering', 'SOAR playbook automation'],
    recommendedSkills: ['SIEM (Splunk/Sentinel)', 'EDR Tools (CrowdStrike/Defender)', 'Network Defense Basics', 'Incident Handling (EC-Council ECIH)'],
    dailyLife: [
      'Reviewing Tier-1 and Tier-2 security incident queues',
      'Executing remediation playbooks to quarantine compromised accounts',
      'Correlating firewall, DNS, and authentication event logs',
      'Collaborating with threat response squads during active breaches'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9 – 16 LPA' },
      { level: 'Senior (5+ yr)', range: '₹16 – 26+ LPA' }
    ],
    pros: ['Best entry door into enterprise cybersecurity', 'Direct hands-on experience with real cyber threats', 'Fast promotion to Tier-2 / Lead Analyst'],
    cons: ['Rotating day/night shift schedules', 'Repetitive false-positive screening'],
    dayInLife: 'Taking over the morning shift handover, analyzing a burst of brute-force login attempts on the corporate VPN, blocking malicious IP ranges, and updating firewall rules.'
  },
  {
    id: 'security-engineer',
    title: 'Security Engineer',
    primaryCategory: 'CY',
    secondaryCategories: ['SW', 'EE'],
    field: 'Cybersecurity',
    salaryRange: '₹6 – 16 LPA',
    growth: 'High Demand',
    icon: 'Lock',
    overview: 'Design, build, and maintain automated security infrastructure, encryption pipelines, identity systems, and cloud defenses.',
    requiredSkills: [
      { name: 'Cloud Security (AWS/Azure)', level: 85 },
      { name: 'DevSecOps & CI/CD Security', level: 80 },
      { name: 'Cryptography & Identity (IAM/OAuth)', level: 80 },
      { name: 'Infrastructure as Code (Terraform)', level: 75 },
      { name: 'Python / Go Security Tooling', level: 75 }
    ],
    strengths: ['Architectural foresight', 'Security-by-design mindset', 'Automated defense engineering'],
    skillGaps: ['Zero-trust network architecture', 'Container security hardening', 'Threat modeling frameworks (STRIDE)'],
    recommendedSkills: ['AWS Certified Security', 'Docker/K8s Security', 'Terraform', 'Python Automation', 'OWASP Top 10'],
    dailyLife: [
      'Implementing automated security scanning in GitHub Actions CI/CD pipelines',
      'Configuring least-privilege IAM policies and multi-factor auth gates',
      'Hardening cloud storage buckets and virtual private clouds',
      'Conducting architectural threat modeling reviews with dev teams'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹5 – 8 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹8 – 15 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹15 – 26 LPA' },
      { level: 'Senior (5+ yr)', range: '₹26 – 45+ LPA' }
    ],
    pros: ['High compensation and respect from software engineering teams', 'Build security systems rather than just responding to alerts', 'Strong cloud specialization'],
    cons: ['Balancing tight developer velocity with strict security guardrails requires strong diplomacy'],
    dayInLife: 'Configuring automated SAST/DAST scanners in the build pipeline, conducting a threat modeling session for a new payments API, and rotating root encryption keys.'
  },
  {
    id: 'ethical-hacker',
    title: 'Ethical Hacker / Penetration Tester',
    primaryCategory: 'CY',
    secondaryCategories: ['SW', 'RES'],
    field: 'Cybersecurity',
    salaryRange: '₹5.5 – 15 LPA',
    growth: 'High Demand',
    icon: 'Terminal',
    overview: 'Legally simulate attacks on web applications, networks, and mobile apps to find security holes before malicious hackers do.',
    requiredSkills: [
      { name: 'Web App Pentesting (Burp Suite)', level: 90 },
      { name: 'Exploit Research & Vulnerability PoCs', level: 80 },
      { name: 'Network Penetration Testing (Metasploit)', level: 80 },
      { name: 'Reverse Engineering Basics', level: 70 },
      { name: 'Executive Security Reporting', level: 75 }
    ],
    strengths: ['Unconventional out-of-the-box thinking', 'Relentless puzzle curiosity', 'Adversarial mindset'],
    skillGaps: ['Active Directory penetration', 'Cloud-native pentesting', 'Mobile binary decompilation'],
    recommendedSkills: ['Burp Suite Professional', 'OSCP / CEH Practical', 'Kali Linux', 'Python Exploit Scripting', 'OWASP Top 10 Web Vulnerabilities'],
    dailyLife: [
      'Testing web apps with manual and automated injection attacks',
      'Bypassing authentication gates and finding logic flaws',
      'Writing detailed Proof-of-Concept vulnerability reports',
      'Participating in bug bounty programs and red team exercises'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹4.5 – 7.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹7.5 – 14 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹14 – 24 LPA' },
      { level: 'Senior (5+ yr)', range: '₹24 – 42+ LPA' }
    ],
    pros: ['Exciting, gamified problem solving (CTFs & bug bounties)', 'Lucrative bounty payouts on platforms like HackerOne', 'High demand for specialized penetration testers'],
    cons: ['Writing comprehensive multi-page audit reports after every assessment', 'Requires strict legal authorization boundaries'],
    dayInLife: 'Intercepting API requests in Burp Suite, finding an IDOR vulnerability in an e-commerce checkout flow, crafting a clean proof-of-concept, and documenting the fix for engineers.'
  },

  // ==================== 4. UI/UX & DESIGN (UX) ====================
  {
    id: 'ui-designer',
    title: 'UI Designer',
    primaryCategory: 'UX',
    secondaryCategories: ['MED', 'SW'],
    field: 'Design',
    salaryRange: '₹4 – 11 LPA',
    growth: 'Growing',
    icon: 'Palette',
    overview: 'Craft visual interfaces, typography systems, color schemes, icons, and micro-interactions for digital products.',
    requiredSkills: [
      { name: 'Figma & Design Systems', level: 90 },
      { name: 'Visual Typography & Hierarchy', level: 85 },
      { name: 'Color Theory & Accessibility', level: 85 },
      { name: 'Iconography & Vector Illustration', level: 80 },
      { name: 'Interactive Micro-prototyping', level: 75 }
    ],
    strengths: ['Visual aesthetics sensitivity', 'Pixel precision', 'Design system discipline', 'Brand expression'],
    skillGaps: ['Design tokens code-handoff', 'Dynamic variable prototyping in Figma', 'Motion design in After Effects / Rive'],
    recommendedSkills: ['Figma Mastery', 'Design Systems (Atomic Design)', 'Color & Typography Theory', 'Auto-Layout & Components', 'Basic HTML/CSS understanding'],
    dailyLife: [
      'Building scalable component libraries and UI design systems in Figma',
      'Designing pixel-perfect mockups across desktop, tablet, and mobile views',
      'Creating interactive prototypes to demonstrate animations and flows',
      'Collaborating with frontend engineers on visual design QA reviews'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9.5 – 17 LPA' },
      { level: 'Senior (5+ yr)', range: '₹17 – 28+ LPA' }
    ],
    pros: ['Deep creative satisfaction and visual portfolio expression', 'High startup and creative agency demand', 'Vibrant global design community'],
    cons: ['Subjective feedback from multiple non-designer stakeholders', 'Design trends evolve rapidly'],
    dayInLife: 'Refining the dark mode color palette in Figma, building reusable button and input variants, creating interactive screen transitions, and exporting assets for the mobile team.'
  },
  {
    id: 'ux-designer',
    title: 'UX Designer',
    primaryCategory: 'UX',
    secondaryCategories: ['RES', 'BM'],
    field: 'Design',
    salaryRange: '₹4.5 – 12 LPA',
    growth: 'High Demand',
    icon: 'PenTool',
    overview: 'Solve user friction, structure information architecture, map user journeys, and ensure apps are intuitive and painless to use.',
    requiredSkills: [
      { name: 'User Journey Mapping & Wireframing', level: 90 },
      { name: 'Information Architecture', level: 85 },
      { name: 'Figma Prototyping', level: 85 },
      { name: 'Usability Testing & Feedback', level: 80 },
      { name: 'Problem Framing & Empathy', level: 85 }
    ],
    strengths: ['User empathy', 'Analytical thinking applied to human behavior', 'Simplifying complex workflows', 'Communication'],
    skillGaps: ['Quantitative UX metrics analysis', 'Service blueprinting', 'Complex enterprise ergonomics'],
    recommendedSkills: ['Figma Wireframing', 'User Research Methodologies', 'Usability Testing', 'Information Architecture', 'Product Thinking'],
    dailyLife: [
      'Conducting user interviews and mapping step-by-step user journeys',
      'Drafting low-fidelity wireframes to explore multiple layout ideas',
      'Running usability tests to uncover where students get stuck',
      'Aligning product managers and developers around user needs'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 6 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6 – 11 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹11 – 19 LPA' },
      { level: 'Senior (5+ yr)', range: '₹19 – 32+ LPA' }
    ],
    pros: ['Make technology genuinely human-friendly', 'Highly valued strategic position', 'Strong career mobility into Product Management'],
    cons: ['Advocating for user needs against tight business deadlines requires persistence'],
    dayInLife: 'Synthesizing feedback from 5 user testing recordings, restructuring the assessment checkout flow wireframe, and presenting a simplified user journey to the engineering squad.'
  },
  {
    id: 'product-designer',
    title: 'Product Designer',
    primaryCategory: 'UX',
    secondaryCategories: ['BM', 'SW'],
    field: 'Design',
    salaryRange: '₹6 – 16 LPA',
    growth: 'High Demand',
    icon: 'Compass',
    overview: 'Own end-to-end digital product design from initial research and business strategy to high-fidelity UI and developer handoff.',
    requiredSkills: [
      { name: 'End-to-end UX/UI Mastery (Figma)', level: 90 },
      { name: 'Product Strategy & Business Metrics', level: 80 },
      { name: 'Design Systems & Tokens', level: 85 },
      { name: 'Prototyping & Micro-animations', level: 80 },
      { name: 'Cross-functional Collaboration', level: 85 }
    ],
    strengths: ['Business acumen meets visual excellence', 'End-to-end product ownership', 'Stakeholder alignment', 'Strategic vision'],
    skillGaps: ['Data-driven A/B test analysis', 'Executive design presentation', 'Technical system constraints'],
    recommendedSkills: ['Full-stack Figma', 'Product Metrics (Retention/Conversion)', 'Design Systems', 'User Research Synthesis', 'Design Leadership'],
    dailyLife: [
      'Defining core user problems alongside Product Managers',
      'Designing complete multi-screen product features in Figma',
      'Reviewing live builds with developers to ensure pixel-perfect fidelity',
      'Analyzing post-launch metrics to iterate on user retention'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹5 – 8 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹8 – 15 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹15 – 26 LPA' },
      { level: 'Senior (5+ yr)', range: '₹26 – 45+ LPA' }
    ],
    pros: ['Highest strategic design role in modern tech', 'Direct impact on revenue and product success', 'Top-tier tech compensation'],
    cons: ['Heavy responsibility balancing business trade-offs, engineering constraints, and user happiness'],
    dayInLife: 'Kicking off a discovery workshop on a new student roadmap feature, designing high-fidelity components, and aligning engineering on feasibility.'
  },
  {
    id: 'ux-researcher',
    title: 'UX Researcher',
    primaryCategory: 'UX',
    secondaryCategories: ['RES', 'EDU'],
    field: 'Design',
    salaryRange: '₹5 – 13 LPA',
    growth: 'Growing',
    icon: 'Search',
    overview: 'Conduct qualitative and quantitative research with real users to uncover pain points, mental models, and validated insights.',
    requiredSkills: [
      { name: 'User Interviewing & Ethnography', level: 90 },
      { name: 'Usability Testing & Task Analysis', level: 85 },
      { name: 'Survey Design & Quantitative Analysis', level: 80 },
      { name: 'Insight Synthesis & Storytelling', level: 85 },
      { name: 'Persona & Journey Construction', level: 80 }
    ],
    strengths: ['Deep active listening', 'Scientific curiosity about human behavior', 'Objective data synthesis', 'Empathy'],
    skillGaps: ['Statistical survey significance modeling', 'Unmoderated testing automation', 'Executive reporting impact'],
    recommendedSkills: ['Qualitative Interview Techniques', 'Usability Testing Platforms (UserTesting/Maze)', 'Survey Methodologies', 'Thematic Coding', 'Data Storytelling'],
    dailyLife: [
      'Formulating research hypotheses and recruiting student participants',
      'Conducting 1-on-1 discovery interviews and card-sorting exercises',
      'Tagging and coding interview transcripts for recurring themes',
      'Delivering actionable insight presentations to product teams'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹4 – 6.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6.5 – 12 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹12 – 20 LPA' },
      { level: 'Senior (5+ yr)', range: '₹20 – 35+ LPA' }
    ],
    pros: ['Deeply intellectual human-centric work', 'Shields product teams from building the wrong things', 'High influence on company direction'],
    cons: ['Translating research findings into engineer-ready action items requires strong storytelling'],
    dayInLife: 'Running 3 remote usability sessions on a new mobile onboarding flow, extracting highlight video clips, and presenting 4 major user blockers to the leadership team.'
  },

  // ==================== 5. ELECTRONICS & ENGINEERING (EE) ====================
  {
    id: 'electronics-engineer',
    title: 'Electronics Engineer',
    primaryCategory: 'EE',
    secondaryCategories: ['SW', 'RES'],
    field: 'Engineering',
    salaryRange: '₹4 – 11 LPA',
    growth: 'High Demand',
    icon: 'Cpu',
    overview: 'Design, simulate, test, and manufacture electronic circuits, PCBs, microcontrollers, and hardware devices.',
    requiredSkills: [
      { name: 'Circuit Design & Analysis', level: 85 },
      { name: 'PCB Design (KiCAD / Altium)', level: 85 },
      { name: 'Microcontrollers (Arduino / STM32)', level: 80 },
      { name: 'Testing Equipment (Oscilloscope, Multimeter)', level: 85 },
      { name: 'C/C++ for Hardware', level: 75 }
    ],
    strengths: ['Hands-on physical troubleshooting', 'Mathematical circuit comprehension', 'Attention to hardware tolerance'],
    skillGaps: ['High-speed PCB layout impedance matching', 'EMI/EMC compliance testing', 'Firmware integration'],
    recommendedSkills: ['KiCAD / Altium Designer', 'C/C++ for Microcontrollers', 'Analog & Digital Circuit Design', 'STM32 Architecture', 'Lab Equipment Debugging'],
    dailyLife: [
      'Designing schematic diagrams and routing multi-layer PCBs',
      'Soldering and assembling hardware test prototypes',
      'Using oscilloscopes and logic analyzers to trace signal integrity',
      'Collaborating with firmware engineers on board bring-up'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9.5 – 17 LPA' },
      { level: 'Senior (5+ yr)', range: '₹17 – 30+ LPA' }
    ],
    pros: ['Tangible physical creation you can hold and touch', 'Crucial hardware revolution in EVs, consumer tech, and defense', 'High barrier to entry protect jobs'],
    cons: ['Hardware bug fixes require physical iterations and manufacturing lead times'],
    dayInLife: 'Routing a 4-layer PCB for a sensor board in KiCad, testing signal noise on an oscilloscope, and ordering component samples from distributors.'
  },
  {
    id: 'embedded-systems-engineer',
    title: 'Embedded Systems Engineer',
    primaryCategory: 'EE',
    secondaryCategories: ['SW', 'CY'],
    field: 'Engineering',
    salaryRange: '₹5 – 14 LPA',
    growth: 'High Demand',
    icon: 'Radio',
    overview: 'Write low-level firmware and device drivers that control microcontrollers inside vehicles, medical devices, robots, and IoT gear.',
    requiredSkills: [
      { name: 'Embedded C / C++', level: 90 },
      { name: 'Microcontroller Architecture (ARM Cortex)', level: 85 },
      { name: 'Communication Protocols (I2C, SPI, UART, CAN)', level: 85 },
      { name: 'RTOS (FreeRTOS) & Memory Management', level: 80 },
      { name: 'Hardware Debugging (JTAG/SWD)', level: 75 }
    ],
    strengths: ['Low-level binary thinking', 'Resource-constrained optimization', 'Hardware-software bridge mastery'],
    skillGaps: ['Embedded Linux kernel module development', 'Hardware security modules (HSM)', 'Automotive standards (AUTOSAR)'],
    recommendedSkills: ['Embedded C', 'FreeRTOS', 'ARM Cortex-M Programming', 'SPI/I2C/UART Protocols', 'JTAG Debugging'],
    dailyLife: [
      'Writing interrupt service routines and peripheral drivers in C',
      'Managing tight memory buffers and sub-millisecond execution loops',
      'Debugging board bring-up issues using logic analyzers',
      'Flashing and verifying firmware builds on prototype hardware'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹4 – 6.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6.5 – 12 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹12 – 22 LPA' },
      { level: 'Senior (5+ yr)', range: '₹22 – 38+ LPA' }
    ],
    pros: ['Work at the true intersection of code and the physical world', 'Critical in automotive, aerospace, and medical sectors', 'Very strong long-term career stability'],
    cons: ['Debugging memory leaks with limited memory tools requires high patience'],
    dayInLife: 'Writing a FreeRTOS task to read sensor data over I2C, optimizing power consumption for sleep mode, and tracing clock jitter on a logic analyzer.'
  },
  {
    id: 'robotics-engineer',
    title: 'Robotics Engineer',
    primaryCategory: 'EE',
    secondaryCategories: ['AI', 'SW'],
    field: 'Engineering',
    salaryRange: '₹5.5 – 15 LPA',
    growth: 'Rapidly Growing',
    icon: 'Bot',
    overview: 'Design, program, and operate automated robotic arms, autonomous mobile robots (AMRs), and smart mechatronic systems.',
    requiredSkills: [
      { name: 'ROS / ROS 2 (Robot Operating System)', level: 85 },
      { name: 'C++ & Python for Robotics', level: 85 },
      { name: 'Kinematics & Motion Planning', level: 80 },
      { name: 'Sensors (LiDAR, Cameras, IMUs)', level: 80 },
      { name: 'Control Systems & PID Tuning', level: 75 }
    ],
    strengths: ['Interdisciplinary mechatronics thinking', 'Spatial visualization', 'Real-world physical problem solving'],
    skillGaps: ['SLAM (Simultaneous Localization & Mapping)', 'Computer vision integration', 'Reinforcement learning for motor control'],
    recommendedSkills: ['ROS 2', 'C++ & Python', 'Kinematics Fundamentals', 'Gazebo Simulation', 'OpenCV for Robotics'],
    dailyLife: [
      'Simulating robot navigation models in Gazebo',
      'Tuning PID motor controllers for precise joint articulation',
      'Integrating LiDAR and stereo camera data for obstacle avoidance',
      'Running field calibration tests on physical robot chassis'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹4.5 – 7 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹7 – 13 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹13 – 24 LPA' },
      { level: 'Senior (5+ yr)', range: '₹24 – 42+ LPA' }
    ],
    pros: ['Exciting futuristic engineering domain', 'High demand in industrial automation, logistics, and healthcare', 'Deeply rewarding tangible results'],
    cons: ['Hardware breakdowns during live testing', 'Demands broad multi-disciplinary competence across mechanical, electrical, and software'],
    dayInLife: 'Calibrating a 2D LiDAR sensor in ROS 2, running SLAM mapping in a laboratory warehouse, and tuning velocity limits for safe autonomous navigation.'
  },
  {
    id: 'iot-engineer',
    title: 'IoT Engineer (Internet of Things)',
    primaryCategory: 'EE',
    secondaryCategories: ['SW', 'CY'],
    field: 'Engineering',
    salaryRange: '₹4.5 – 13 LPA',
    growth: 'High Demand',
    icon: 'Wifi',
    overview: 'Connect physical sensor devices, smart home equipment, and industrial machinery to cloud analytics platforms over wireless networks.',
    requiredSkills: [
      { name: 'ESP32 / Raspberry Pi Programming', level: 85 },
      { name: 'IoT Protocols (MQTT, CoAP, BLE, LoRaWAN)', level: 85 },
      { name: 'Cloud IoT Hubs (AWS IoT / Azure IoT)', level: 80 },
      { name: 'C/C++ & Python', level: 80 },
      { name: 'Device Security & OTA Updates', level: 75 }
    ],
    strengths: ['Network curiosity', 'End-to-end device-to-cloud thinking', 'Resource efficiency focus'],
    skillGaps: ['Ultra-low-power battery profiling', 'Fleet OTA firmware management', 'Industrial Modbus/CAN integration'],
    recommendedSkills: ['ESP32 (ESP-IDF/Arduino)', 'MQTT & HTTP Protocols', 'AWS IoT Core', 'C/C++ & Python', 'Sensor Interfacing'],
    dailyLife: [
      'Connecting temperature, vibration, and energy sensors to ESP32 boards',
      'Publishing sensor payloads over lightweight MQTT topics to AWS IoT',
      'Building device telemetry dashboards and alert thresholds',
      'Testing power consumption across sleep and active transmit cycles'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 6 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6 – 11 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹11 – 19 LPA' },
      { level: 'Senior (5+ yr)', range: '₹19 – 32+ LPA' }
    ],
    pros: ['Fastest way to turn any dumb physical object into a smart connected device', 'Key technology in smart cities, agriculture, and industrial telemetry', 'Great balance of hardware and cloud software'],
    cons: ['Wireless network instability requires robust edge reconnect logic'],
    dayInLife: 'Flashing an ESP32 with firmware that collects ambient temperature, transmitting data via MQTT over WiFi to an AWS IoT dashboard, and optimizing deep sleep cycles.'
  },

  // ==================== 6. BUSINESS & MANAGEMENT (BM) ====================
  {
    id: 'business-analyst',
    title: 'Business Analyst',
    primaryCategory: 'BM',
    secondaryCategories: ['FIN', 'SW'],
    field: 'Business',
    salaryRange: '₹5 – 13 LPA',
    growth: 'High Demand',
    icon: 'Briefcase',
    overview: 'Analyze business workflows, gather customer requirements, and translate strategic business goals into clear technical specifications.',
    requiredSkills: [
      { name: 'Requirements Gathering & BRD/PRD Creation', level: 90 },
      { name: 'Process Flowcharting (BPMN / Visio / Miro)', level: 85 },
      { name: 'Data Analysis (SQL & Excel)', level: 80 },
      { name: 'Stakeholder Communication & Negotiation', level: 85 },
      { name: 'Agile / Scrum Methodologies', level: 80 }
    ],
    strengths: ['Structured systems thinking', 'Clear verbal & written communication', 'Consensus building', 'Commercial orientation'],
    skillGaps: ['Technical API documentation', 'Cost-benefit modeling depth', 'Advanced statistical trend forecasting'],
    recommendedSkills: ['Business Requirements Documentation (BRD)', 'SQL & Excel Analysis', 'Jira & Agile Workflows', 'Process Mapping (BPMN)', 'Stakeholder Management'],
    dailyLife: [
      'Interviewing business leaders to understand process bottlenecks',
      'Drafting Business Requirement Documents (BRDs) and Jira user stories',
      'Running sprint grooming sessions with engineering leads',
      'Validating user acceptance testing (UAT) criteria before launch'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹4 – 6.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6.5 – 11 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹11 – 19 LPA' },
      { level: 'Senior (5+ yr)', range: '₹19 – 32+ LPA' }
    ],
    pros: ['High visibility across business and engineering divisions', 'Smooth pathway into Product Management or Management Consulting', 'High demand across all corporate sectors'],
    cons: ['Managing conflicting priorities between demanding stakeholders and engineering bandwidth'],
    dayInLife: 'Meeting with the operations director to map their order fulfillment workflow, documenting edge cases in Jira user stories, and presenting the proposed tech architecture to developers.'
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    primaryCategory: 'BM',
    secondaryCategories: ['UX', 'SW'],
    field: 'Business',
    salaryRange: '₹8 – 22 LPA',
    growth: 'High Demand',
    icon: 'Target',
    overview: 'Act as the "mini-CEO" of a feature or product, defining what to build, why to build it, and guiding engineering and design teams to success.',
    requiredSkills: [
      { name: 'Product Strategy & Roadmapping', level: 90 },
      { name: 'User Empathy & Customer Discovery', level: 85 },
      { name: 'Data-driven Decision Making (Mixpanel/GA)', level: 85 },
      { name: 'Cross-functional Team Leadership', level: 90 },
      { name: 'Agile Backlog Prioritization', level: 85 }
    ],
    strengths: ['Strategic prioritization', 'Decisiveness with incomplete data', 'Inspiring leadership without direct authority', 'Commercial instincts'],
    skillGaps: ['Technical system latency trade-offs', 'Financial unit economics modeling', 'Competitive moat creation'],
    recommendedSkills: ['Product Roadmapping (Linear/Jira)', 'Product Analytics (Mixpanel/Amplitude)', 'PRD Writing', 'A/B Testing Frameworks', 'Customer Discovery Interviews'],
    dailyLife: [
      'Defining quarterly feature roadmaps aligned with business KPIs',
      'Running customer discovery interviews to validate unmet needs',
      'Prioritizing bug fixes vs. new feature developments in sprint planning',
      'Analyzing cohort retention and funnel conversion drop-offs'
    ],
    salaryProgression: [
      { level: 'Fresher (APM 0-1 yr)', range: '₹6 – 12 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹12 – 20 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹20 – 35 LPA' },
      { level: 'Senior (5+ yr)', range: '₹35 – 65+ LPA' }
    ],
    pros: ['Direct ownership of product success and strategy', 'One of the highest-paying and most respected roles in modern tech', 'Prepares you for executive leadership or founding a startup'],
    cons: ['Accountability for product failure without direct managerial authority over engineers'],
    dayInLife: 'Reviewing daily active user metrics over coffee, running the sprint prioritization meeting, conducting 2 user feedback calls, and presenting next quarter\'s roadmap to the VP of Product.'
  },
  {
    id: 'operations-manager',
    title: 'Operations Manager',
    primaryCategory: 'BM',
    secondaryCategories: ['FIN', 'GOV'],
    field: 'Business',
    salaryRange: '₹4.5 – 12 LPA',
    growth: 'Steady Demand',
    icon: 'TrendingUp',
    overview: 'Ensure daily company operations, supply chains, logistics, quality controls, and team resources run smoothly and cost-effectively.',
    requiredSkills: [
      { name: 'Process Optimization & Lean/Six Sigma', level: 85 },
      { name: 'Resource & Capacity Planning', level: 85 },
      { name: 'Vendor & Supply Chain Management', level: 80 },
      { name: 'Cost Management & Budgeting', level: 80 },
      { name: 'Team Leadership & Performance Metrics', level: 85 }
    ],
    strengths: ['Organizational discipline', 'Practical problem-solving instinct', 'Cool-headed execution under logistics pressure', 'People coordination'],
    skillGaps: ['Automated ERP workflow modeling', 'Predictive inventory replenishment', 'Contract negotiation tactics'],
    recommendedSkills: ['Supply Chain & Logistics Basics', 'Lean / Six Sigma Principles', 'Excel / ERP Systems', 'Team Operations Management', 'KPI Tracking'],
    dailyLife: [
      'Monitoring daily throughput, delivery timelines, and defect rates',
      'Resolving vendor supply bottlenecks and inventory shortages',
      'Optimizing departmental staffing schedules and operational costs',
      'Implementing standard operating procedures (SOPs) for quality control'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9.5 – 17 LPA' },
      { level: 'Senior (5+ yr)', range: '₹17 – 28+ LPA' }
    ],
    pros: ['Essential role across e-commerce, manufacturing, startups, and services', 'Clear performance impact on profitability', 'Strong executive pathway to COO'],
    cons: ['Requires handling unexpected logistical emergencies and supply chain disruptions'],
    dayInLife: 'Reviewing yesterday\'s fulfillment metrics, renegotiating a vendor contract to reduce shipping costs by 8%, and auditing the warehouse safety checklist.'
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur / Startup Founder',
    primaryCategory: 'BM',
    secondaryCategories: ['MKT', 'SW'],
    field: 'Business',
    salaryRange: 'Variable / High Upside',
    growth: 'High Potential',
    icon: 'Zap',
    overview: 'Identify a massive unsolved problem, build an innovative product or service, hire a team, and scale a self-sustaining venture.',
    requiredSkills: [
      { name: 'Venture Building & Product-Market Fit', level: 90 },
      { name: 'Pitching & Fundraising', level: 85 },
      { name: 'Sales & Customer Acquisition', level: 85 },
      { name: 'Financial Planning & Cashflow Management', level: 80 },
      { name: 'Resilience & Visionary Leadership', level: 95 }
    ],
    strengths: ['High risk appetite', 'Relentless persistence', 'Charismatic storytelling and hiring ability', 'Holistic problem solving'],
    skillGaps: ['Legal equity structuring and cap tables', 'Delegating control as the team scales', 'Unit economics profitability'],
    recommendedSkills: ['Lean Startup Methodology', 'Pitch Deck Creation', 'Customer Discovery & Validation', 'Basic Financial Modeling', 'Digital Marketing & Sales'],
    dailyLife: [
      'Pitching prospective customers and closing initial pilot contracts',
      'Iterating on the MVP product with early beta users',
      'Interviewing and recruiting top talent to join the mission',
      'Managing cash runway and pitching angel investors / VCs'
    ],
    salaryProgression: [
      { level: 'Early Stage (0-2 yr)', range: '₹0 – 6 LPA + Equity' },
      { level: 'Growth Stage (2-4 yr)', range: '₹12 – 25 LPA + Equity' },
      { level: 'Scale Stage (4+ yr)', range: '₹25 – 60+ LPA + Significant Equity Value' }
    ],
    pros: ['Total autonomy and freedom to build your own vision', 'Unlimited financial upside through equity ownership', 'Profound impact on industries and society'],
    cons: ['High uncertainty and psychological stress during early phases', 'Long working hours in the launch period'],
    dayInLife: 'Interviewing 3 target customers in the morning, reviewing the product MVP build, pitching a venture capital partner over lunch, and onboarding a new founding engineer.'
  },

  // ==================== 7. FINANCE (FIN) ====================
  {
    id: 'financial-analyst',
    title: 'Financial Analyst',
    primaryCategory: 'FIN',
    secondaryCategories: ['BM', 'RES'],
    field: 'Finance',
    salaryRange: '₹4.5 – 12 LPA',
    growth: 'High Demand',
    icon: 'CircleDollarSign',
    overview: 'Evaluate financial data, build DCF and forecasting models, analyze company performance, and advise on smart capital investment decisions.',
    requiredSkills: [
      { name: 'Financial Modeling & Valuation (DCF, Multiples)', level: 85 },
      { name: 'Advanced Excel & Financial Functions', level: 90 },
      { name: 'Financial Statement Analysis (P&L, Balance Sheet)', level: 90 },
      { name: 'Variance Analysis & Budgeting', level: 80 },
      { name: 'PowerPoint & Investment Memorandums', level: 80 }
    ],
    strengths: ['Quantitative precision', 'High numerical comfort', 'Analytical skepticism', 'Attention to fiscal detail'],
    skillGaps: ['Macroeconomic sensitivity modeling', 'Python for financial automation', 'M&A synergy calculation'],
    recommendedSkills: ['Financial Modeling in Excel', 'Financial Statement Analysis', 'CFA Level 1 concepts', 'Valuation Methodologies', 'PowerPoint Presentation'],
    dailyLife: [
      'Building 3-statement financial models and scenario forecasts in Excel',
      'Analyzing quarterly earnings reports and cost variances',
      'Drafting investment memos and feasibility briefs for CFOs',
      'Benchmarking industry competitors against key financial ratios'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹4 – 6.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6.5 – 11 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹11 – 20 LPA' },
      { level: 'Senior (5+ yr)', range: '₹20 – 35+ LPA' }
    ],
    pros: ['Foundational role across banking, corporate finance, and consulting', 'Direct understanding of how capital creates wealth', 'Strong credential progression (CFA, MBA)'],
    cons: ['Intense work hours during quarterly earnings seasons and financial year-ends'],
    dayInLife: 'Building a 5-year discounted cash flow (DCF) model for a new expansion project, analyzing departmental budget variances, and preparing summary slides for the CFO.'
  },
  {
    id: 'risk-analyst',
    title: 'Risk Analyst',
    primaryCategory: 'FIN',
    secondaryCategories: ['CY', 'LAW'],
    field: 'Finance',
    salaryRange: '₹5 – 13 LPA',
    growth: 'High Demand',
    icon: 'ShieldAlert',
    overview: 'Identify, quantify, and mitigate financial, credit, market, and operational risks facing banks and investment firms.',
    requiredSkills: [
      { name: 'Quantitative Risk Modeling (VaR, Stress Testing)', level: 85 },
      { name: 'Credit & Market Risk Analysis', level: 85 },
      { name: 'Regulatory Compliance (Basel III, RBI norms)', level: 80 },
      { name: 'SQL & Statistical Software (R/Python)', level: 75 },
      { name: 'Risk Mitigation Strategy', level: 80 }
    ],
    strengths: ['Prudent risk calculation', 'Worst-case scenario foresight', 'Statistical probability intuition', 'Ethical vigilance'],
    skillGaps: ['Algorithmic liquidity risk modeling', 'Cyber-risk insurance estimation', 'Macro-stress scenario design'],
    recommendedSkills: ['FRM (Financial Risk Manager) concepts', 'Credit Risk Modeling', 'Excel / Python for Statistics', 'Banking Regulations (RBI/Basel)', 'SQL'],
    dailyLife: [
      'Running automated Monte Carlo simulations to assess portfolio downside risk',
      'Evaluating creditworthiness of corporate loan applicants',
      'Ensuring trading operations comply with central bank capital adequacy limits',
      'Presenting weekly risk exposure dashboards to the investment committee'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹4 – 6.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6.5 – 12 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹12 – 22 LPA' },
      { level: 'Senior (5+ yr)', range: '₹22 – 38+ LPA' }
    ],
    pros: ['Essential safeguards role in banks, fintechs, and hedge funds', 'High job security during economic downturns', 'Strong professional prestige (FRM certification)'],
    cons: ['Balancing revenue growth targets with conservative risk parameters requires firm diplomacy'],
    dayInLife: 'Running value-at-risk (VaR) calculations on the foreign exchange trading book, assessing borrower default probabilities, and drafting the monthly risk committee report.'
  },
  {
    id: 'investment-analyst',
    title: 'Investment Analyst',
    primaryCategory: 'FIN',
    secondaryCategories: ['RES', 'BM'],
    field: 'Finance',
    salaryRange: '₹6 – 16 LPA',
    growth: 'High Demand',
    icon: 'LineChart',
    overview: 'Research public markets, equities, and private equity deals to uncover profitable investment opportunities for funds and clients.',
    requiredSkills: [
      { name: 'Equity Research & Industry Deep Dives', level: 90 },
      { name: 'Company Valuation (DCF, LBO, Multiples)', level: 85 },
      { name: 'Financial Statement Forensic Analysis', level: 85 },
      { name: 'Macroeconomic Trend Interpretation', level: 80 },
      { name: 'Investment Thesis Pitching', level: 85 }
    ],
    strengths: ['Intellectual rigor in markets', 'Dissecting corporate business models', 'Independent conviction', 'Financial literacy'],
    skillGaps: ['LBO (Leveraged Buyout) debt structuring', 'Alternative data web scraping', 'Management team psychometric evaluation'],
    recommendedSkills: ['CFA Curriculum', 'Equity Research Methodologies', 'Advanced Financial Modeling', 'Sector Analysis', 'Bloomberg / Capital IQ usage'],
    dailyLife: [
      'Reading company annual reports (10-K) and earnings call transcripts',
      'Building detailed financial forecasting models for public companies',
      'Interviewing industry executives and channel partners for scuttlebutt research',
      'Pitching buy/sell recommendations to portfolio managers'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹5 – 9 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹9 – 16 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹16 – 30 LPA' },
      { level: 'Senior (5+ yr)', range: '₹30 – 55+ LPA' }
    ],
    pros: ['Direct involvement in massive capital allocation decisions', 'High performance bonuses in mutual funds and private equity', 'Constant learning about diverse global industries'],
    cons: ['High scrutiny when investment calls underperform market indices'],
    dayInLife: 'Attending a morning earnings conference call, updating the company\'s valuation model with new guidance, and writing a 4-page investment note for the fund manager.'
  },
  {
    id: 'accountant',
    title: 'Accountant / Financial Controller',
    primaryCategory: 'FIN',
    secondaryCategories: ['LAW', 'GOV'],
    field: 'Finance',
    salaryRange: '₹3.5 – 10 LPA',
    growth: 'Steady Demand',
    icon: 'Receipt',
    overview: 'Prepare financial statements, manage tax filings (GST, Income Tax), maintain general ledgers, and ensure strict accounting compliance.',
    requiredSkills: [
      { name: 'Accounting Principles & Standards (Ind AS / IFRS)', level: 90 },
      { name: 'Taxation & Statutory Compliance (GST, TDS, IT)', level: 85 },
      { name: 'Accounting Software (Tally, Zoho Books, SAP)', level: 90 },
      { name: 'Auditing & Reconciliation', level: 85 },
      { name: 'Financial Reporting', level: 80 }
    ],
    strengths: ['Meticulous precision', 'Rule-following integrity', 'Systematic document management', 'Reliability'],
    skillGaps: ['Forensic audit techniques', 'International transfer pricing', 'Automated reconciliations scripting'],
    recommendedSkills: ['Tally Prime / Zoho Books', 'GST & TDS Filings', 'Balance Sheet Preparation', 'Ind AS / GAAP Fundamentals', 'CA / CMA foundation concepts'],
    dailyLife: [
      'Recording daily journal entries, invoices, and payments in Tally/ERP',
      'Reconciling monthly bank statements, GST ledgers, and vendor accounts',
      'Calculating and filing monthly GST and quarterly TDS returns',
      'Preparing financial statements for annual statutory audits'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3 – 4.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹4.5 – 8 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹8 – 15 LPA' },
      { level: 'Senior (5+ yr)', range: '₹15 – 25+ LPA' }
    ],
    pros: ['Every single business entity requires accounting', 'Clear chartered accountancy (CA) prestige ladder', 'High stability and local employment in every town'],
    cons: ['Heavy workload during month-ends and tax filing deadlines'],
    dayInLife: 'Reconciling bank accounts in Zoho Books, calculating GST liability for the month, and preparing supporting schedules for the external audit team.'
  },

  // ==================== 8. MARKETING (MKT) ====================
  {
    id: 'digital-marketing-specialist',
    title: 'Digital Marketing Specialist',
    primaryCategory: 'MKT',
    secondaryCategories: ['MED', 'BM'],
    field: 'Marketing',
    salaryRange: '₹3.5 – 9.5 LPA',
    growth: 'High Demand',
    icon: 'Megaphone',
    overview: 'Plan, execute, and optimize paid and organic marketing campaigns across Google, Meta, email, and social channels to drive user growth.',
    requiredSkills: [
      { name: 'Paid Ads (Meta Ads, Google Ads)', level: 85 },
      { name: 'Social Media Strategy & Content', level: 85 },
      { name: 'Email Marketing & Automations', level: 80 },
      { name: 'Analytics & Attribution (GA4, Meta Pixel)', level: 80 },
      { name: 'Copywriting & Creative Direction', level: 75 }
    ],
    strengths: ['Persuasive communication', 'Creative experimentation', 'Data-driven optimization', 'Consumer trend empathy'],
    skillGaps: ['Conversion rate optimization (CRO) funnel design', 'Programmatic ad buying', 'Attribution modeling across multi-touch channels'],
    recommendedSkills: ['Google Ads Certification', 'Meta Ads Manager', 'Google Analytics 4 (GA4)', 'Email Marketing (Mailchimp/Klaviyo)', 'Basic Copywriting'],
    dailyLife: [
      'Setting up and testing target ad creatives across Instagram and Google',
      'Analyzing cost-per-click (CPC) and customer acquisition cost (CAC)',
      'Designing automated email drip campaigns for newly registered users',
      'Drafting creative briefs for visual designers and copywriters'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3 – 4.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹4.5 – 8 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹8 – 15 LPA' },
      { level: 'Senior (5+ yr)', range: '₹15 – 25+ LPA' }
    ],
    pros: ['Instant quantifiable feedback on campaign performance', 'Massive remote and freelancing opportunities', 'Exciting blend of creative ideas and analytical numbers'],
    cons: ['Ad platform algorithm shifts require constant strategy adjustments'],
    dayInLife: 'Reviewing yesterday\'s Meta Ads ROAS, optimizing ad copy for an underperforming ad set, scheduling an email newsletter, and brainstorming campaign concepts for the weekend.'
  },
  {
    id: 'seo-specialist',
    title: 'SEO Specialist (Search Engine Optimization)',
    primaryCategory: 'MKT',
    secondaryCategories: ['SW', 'MED'],
    field: 'Marketing',
    salaryRange: '₹3.5 – 9 LPA',
    growth: 'Growing',
    icon: 'Globe',
    overview: 'Optimize website structure, content keywords, technical page speed, and backlinks to rank #1 on Google search results.',
    requiredSkills: [
      { name: 'On-Page SEO & Keyword Research (Ahrefs/Semrush)', level: 90 },
      { name: 'Technical SEO (Core Web Vitals, Schema, Sitemaps)', level: 80 },
      { name: 'Link Building & Digital PR', level: 80 },
      { name: 'Google Search Console & GA4', level: 85 },
      { name: 'Content Optimization & Structuring', level: 80 }
    ],
    strengths: ['Searcher intent empathy', 'Analytical persistence', 'Methodical technical auditing', 'Competitive research curiosity'],
    skillGaps: ['Programmatic SEO at scale', 'Log file analysis for crawl budget', 'International multi-language SEO'],
    recommendedSkills: ['Semrush / Ahrefs', 'Google Search Console', 'On-Page & Technical SEO Audits', 'Keyword Strategy', 'Basic HTML & Web Fundamentals'],
    dailyLife: [
      'Conducting keyword research to find high-volume search queries',
      'Auditing website crawl errors and slow page speeds in Search Console',
      'Writing comprehensive content briefs for blog writers',
      'Building high-authority contextual backlinks from industry domains'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3 – 4.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹4.5 – 7.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹7.5 – 14 LPA' },
      { level: 'Senior (5+ yr)', range: '₹14 – 24+ LPA' }
    ],
    pros: ['Drives organic, free, high-intent traffic to businesses', 'Strong freelance & affiliate income possibilities', 'High demand among global e-commerce and SaaS brands'],
    cons: ['Google core algorithm updates can cause sudden traffic fluctuations'],
    dayInLife: 'Reviewing keyword rankings in Semrush, optimizing meta titles and header tags on top landing pages, fixing 404 crawl errors, and planning an organic content calendar.'
  },
  {
    id: 'marketing-analyst',
    title: 'Marketing Analyst',
    primaryCategory: 'MKT',
    secondaryCategories: ['AI', 'FIN'],
    field: 'Marketing',
    salaryRange: '₹4.5 – 11 LPA',
    growth: 'High Demand',
    icon: 'PieChart',
    overview: 'Measure campaign ROI, track customer lifetime value (LTV), perform market research, and evaluate marketing spend efficiency.',
    requiredSkills: [
      { name: 'Marketing Attribution & Funnel Analytics', level: 85 },
      { name: 'SQL & Data Extraction', level: 80 },
      { name: 'Excel / Power BI Visualization', level: 85 },
      { name: 'A/B Testing Statistical Design', level: 80 },
      { name: 'Customer Segmentation & Cohort Analysis', level: 80 }
    ],
    strengths: ['Data-driven decision objectivity', 'Marketing intuition backed by math', 'Budget efficiency mindset'],
    skillGaps: ['Media mix modeling (MMM)', 'Predictive churn modeling in Python', 'Multi-touch attribution scripting'],
    recommendedSkills: ['Google Analytics 4', 'SQL for Marketers', 'Power BI / Tableau', 'Excel Financial & Marketing Formulas', 'A/B Testing Frameworks'],
    dailyLife: [
      'Analyzing customer acquisition cost (CAC) across paid channels',
      'Building visual marketing attribution models in Power BI',
      'Evaluating A/B test conversion significance on landing pages',
      'Reporting marketing budget performance to the Chief Marketing Officer'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9.5 – 17 LPA' },
      { level: 'Senior (5+ yr)', range: '₹17 – 28+ LPA' }
    ],
    pros: ['Bridge the gap between creative marketing spend and bottom-line revenue', 'High executive visibility', 'Strong technical growth path'],
    cons: ['Fragmented tracking data across iOS privacy restrictions requires robust modeling'],
    dayInLife: 'Extracting ad conversion data in SQL, calculating marketing ROI per acquisition channel, and presenting optimization recommendations to marketing leaders.'
  },
  {
    id: 'brand-strategist',
    title: 'Brand Strategist',
    primaryCategory: 'MKT',
    secondaryCategories: ['MED', 'BM'],
    field: 'Marketing',
    salaryRange: '₹5 – 13 LPA',
    growth: 'Growing',
    icon: 'Sparkle',
    overview: 'Define how a company positions itself in the minds of consumers, shaping its brand voice, narrative, values, and competitive differentiation.',
    requiredSkills: [
      { name: 'Brand Positioning & Strategy Frameworks', level: 90 },
      { name: 'Consumer Psychology & Market Research', level: 85 },
      { name: 'Creative Campaign Ideation', level: 85 },
      { name: 'Storytelling & Presentation', level: 90 },
      { name: 'Competitive Landscape Mapping', level: 80 }
    ],
    strengths: ['Emotional resonance intuition', 'Deep cultural trend awareness', 'Compelling narrative articulation', 'High-level synthesis'],
    skillGaps: ['Brand equity financial valuation', 'Omni-channel brand governance', 'Neuro-marketing testing'],
    recommendedSkills: ['Brand Strategy Frameworks', 'Consumer Research & Personas', 'Creative Brief Writing', 'Storytelling & Pitching', 'Cultural Trend Forecasting'],
    dailyLife: [
      'Conducting focus groups and surveys to understand consumer perceptions',
      'Writing brand manifesto documents, tone-of-voice guidelines, and taglines',
      'Crafting creative briefs that inspire design and advertising teams',
      'Monitoring brand sentiment across social media and press coverage'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹4 – 6 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6 – 11 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹11 – 20 LPA' },
      { level: 'Senior (5+ yr)', range: '₹20 – 35+ LPA' }
    ],
    pros: ['High creative and intellectual prestige', 'Shape cultural conversations and iconic brand identities', 'Work with top creative agencies and visionary founders'],
    cons: ['Measuring the exact short-term financial return of branding campaigns can be challenging'],
    dayInLife: 'Facilitating a brand positioning workshop for a new product, distilling competitor differentiation into a 1-page strategy deck, and reviewing creative campaign concepts.'
  },

  // ==================== 9. HEALTHCARE (HC) ====================
  {
    id: 'healthcare-administrator',
    title: 'Healthcare Administrator',
    primaryCategory: 'HC',
    secondaryCategories: ['BM', 'GOV'],
    field: 'Healthcare',
    salaryRange: '₹4 – 11 LPA',
    growth: 'High Demand',
    icon: 'Building2',
    overview: 'Direct the business and operational management of hospitals, clinics, medical departments, and public healthcare facilities.',
    requiredSkills: [
      { name: 'Hospital Operations & Department Management', level: 85 },
      { name: 'Healthcare Regulations & Accreditation (NABH)', level: 85 },
      { name: 'Patient Care Service Quality', level: 80 },
      { name: 'Medical Billing & Health Insurance Coordination', level: 80 },
      { name: 'Staff Scheduling & Resource Allocation', level: 80 }
    ],
    strengths: ['Human-first empathy', 'Crisis management composure', 'Organizational coordination', 'Regulatory compliance'],
    skillGaps: ['Electronic health records (EHR) database integration', 'Clinical audit methodologies', 'Medical equipment capital budgeting'],
    recommendedSkills: ['Hospital Management Principles (MHA)', 'NABH / Quality Standards', 'Healthcare Operations', 'Medical Terminology Basics', 'Patient Relationship Management'],
    dailyLife: [
      'Ensuring smooth inpatient and outpatient patient flow across departments',
      'Overseeing hospital compliance with national healthcare accreditation standards',
      'Managing doctor schedules, nursing staff allocations, and emergency readiness',
      'Resolving patient feedback and optimizing medical billing turnaround'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9 – 16 LPA' },
      { level: 'Senior (5+ yr)', range: '₹16 – 28+ LPA' }
    ],
    pros: ['Direct contribution to human health, healing, and life-saving operations', 'Recession-proof industry with steady lifelong demand', 'Expanding hospital and diagnostic network in India'],
    cons: ['Managing high-stress medical emergencies and patient family concerns'],
    dayInLife: 'Inspecting the emergency department readiness, reviewing NABH quality audit checklists, resolving a health insurance claims hold, and chairing the weekly department heads meeting.'
  },
  {
    id: 'health-data-analyst',
    title: 'Health Data Analyst',
    primaryCategory: 'HC',
    secondaryCategories: ['AI', 'RES'],
    field: 'Healthcare',
    salaryRange: '₹4.5 – 12 LPA',
    growth: 'Rapidly Growing',
    icon: 'HeartPulse',
    overview: 'Analyze clinical records, patient outcomes, epidemic trends, and medical insurance claims to improve patient care and healthcare efficiency.',
    requiredSkills: [
      { name: 'Health Informatics & Medical Coding (ICD-10)', level: 85 },
      { name: 'SQL & Clinical Data Warehouses', level: 85 },
      { name: 'Biostatistics & Epidemiological Methods', level: 80 },
      { name: 'Data Visualization (Power BI / Tableau)', level: 80 },
      { name: 'Health Privacy Regulations (HIPAA / DISHA)', level: 80 }
    ],
    strengths: ['Scientific accuracy', 'Compassionate purpose behind numbers', 'Ethical data handling', 'Structured investigation'],
    skillGaps: ['Genomic data analysis', 'Clinical trial protocol statistics', 'Predictive readmission modeling'],
    recommendedSkills: ['SQL for Healthcare', 'ICD-10 & Medical Terminology', 'Biostatistics Fundamentals', 'Power BI / Tableau', 'Python/R for Health Data'],
    dailyLife: [
      'Querying electronic health record (EHR) databases for patient treatment outcomes',
      'Building clinical dashboards to track infection rates and hospital length-of-stay',
      'Analyzing insurance claims data for fraud and billing discrepancies',
      'Assisting doctors and researchers with statistical health cohorts'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 6 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6 – 10.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹10.5 – 18 LPA' },
      { level: 'Senior (5+ yr)', range: '₹18 – 30+ LPA' }
    ],
    pros: ['Directly use data science to save human lives and improve therapies', 'Rapidly growing health-tech and pharma sector', 'High demand for specialized bioinformatics talent'],
    cons: ['Medical data requires strict privacy compliance and sensitive handling'],
    dayInLife: 'Extracting patient recovery metrics for a cardiac ward in SQL, identifying correlations between medication dosages and recovery times, and presenting findings to the chief medical officer.'
  },
  {
    id: 'healthcare-research-specialist',
    title: 'Healthcare Research Specialist',
    primaryCategory: 'HC',
    secondaryCategories: ['RES', 'EDU'],
    field: 'Healthcare',
    salaryRange: '₹4 – 11 LPA',
    growth: 'Steady Demand',
    icon: 'Microscope',
    overview: 'Design and support clinical trials, epidemiological surveys, public health research, and new diagnostic/drug efficacy studies.',
    requiredSkills: [
      { name: 'Clinical Trial Protocols & GCP Guidelines', level: 85 },
      { name: 'Scientific Literature Review & Synthesis', level: 85 },
      { name: 'Patient Data Collection & Trial Monitoring', level: 80 },
      { name: 'Research Ethics & Institutional Review (IRB)', level: 80 },
      { name: 'Statistical Report Drafting', level: 75 }
    ],
    strengths: ['Rigorous scientific method adherence', 'Patience in long-term studies', 'Meticulous documentation', 'Public health dedication'],
    skillGaps: ['Pharmacovigilance database reporting', 'Advanced biostatistical survival analysis', 'Grant proposal writing'],
    recommendedSkills: ['Good Clinical Practice (GCP) Certification', 'Clinical Research Methodologies', 'Biostatistics', 'Medical Report Writing', 'IRB Ethics Guidelines'],
    dailyLife: [
      'Screening and consenting patient candidates for clinical trial protocols',
      'Monitoring clinical trial site data adherence and safety reporting',
      'Synthesizing peer-reviewed medical literature on emerging treatments',
      'Drafting research documentation for regulatory approval submissions'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5 – 9 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9 – 16 LPA' },
      { level: 'Senior (5+ yr)', range: '₹16 – 26+ LPA' }
    ],
    pros: ['Help bring life-saving medicines and public health treatments to reality', 'Collaborate with leading medical scientists and doctors', 'Global career mobility in pharma and WHO/NGOs'],
    cons: ['Clinical trials require long time horizons and strict regulatory paperwork'],
    dayInLife: 'Reviewing patient adverse event logs from a trial site, cross-referencing clinical lab reports, updating the trial master file, and preparing for an ethics committee review.'
  },

  // ==================== 10. EDUCATION (EDU) ====================
  {
    id: 'teacher-educator',
    title: 'Teacher / Academic Educator',
    primaryCategory: 'EDU',
    secondaryCategories: ['RES', 'MED'],
    field: 'Education',
    salaryRange: '₹3 – 8 LPA',
    growth: 'Steady Demand',
    icon: 'GraduationCap',
    overview: 'Teach students, develop lesson plans, nurture critical thinking, and inspire the next generation in schools or higher education institutes.',
    requiredSkills: [
      { name: 'Pedagogy & Curriculum Delivery', level: 90 },
      { name: 'Clear Explanation & Conceptual Breakdown', level: 90 },
      { name: 'Classroom Management & Student Mentorship', level: 85 },
      { name: 'Assessment & Feedback Design', level: 80 },
      { name: 'Digital Learning Tools (Google Classroom, Kahoot)', level: 75 }
    ],
    strengths: ['Nurturing patience', 'Public speaking and charismatic explanation', 'Deep subject dedication', 'Empathy for student struggles'],
    skillGaps: ['Differentiated learning for diverse needs', 'Gamified interactive lesson creation', 'Formative digital analytics'],
    recommendedSkills: ['Pedagogical Techniques', 'Lesson Planning & Rubrics', 'Digital Education Tools', 'B.Ed / CTET preparation', 'Classroom Engagement Strategies'],
    dailyLife: [
      'Delivering engaging interactive classroom lectures and discussions',
      'Creating homework assignments, quizzes, and constructive grading feedback',
      'Mentoring individual students who are struggling with difficult topics',
      'Communicating student academic progress with parents and school administration'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹2.5 – 4 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹4 – 6.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹6.5 – 11 LPA' },
      { level: 'Senior (5+ yr)', range: '₹11 – 18+ LPA' }
    ],
    pros: ['One of the most respected, socially impactful professions in human society', 'Predictable academic calendar with school holidays', 'Deep emotional fulfillment seeing students succeed'],
    cons: ['Grading papers and lesson prep often spills into personal evenings'],
    dayInLife: 'Teaching 4 morning classes with hands-on demonstrations, holding a student doubt-clearing session after lunch, grading quizzes, and preparing tomorrow\'s lesson plan.'
  },
  {
    id: 'corporate-trainer',
    title: 'Corporate Trainer / L&D Specialist',
    primaryCategory: 'EDU',
    secondaryCategories: ['BM', 'MED'],
    field: 'Education',
    salaryRange: '₹4.5 – 12 LPA',
    growth: 'High Demand',
    icon: 'Users',
    overview: 'Design and deliver professional upskilling programs, leadership workshops, and technical onboarding for corporate employees.',
    requiredSkills: [
      { name: 'Adult Learning Theory (Andragogy)', level: 85 },
      { name: 'Workshop Facilitation & Public Speaking', level: 90 },
      { name: 'Training Needs Analysis (TNA)', level: 85 },
      { name: 'Training Material & Slide Deck Design', level: 85 },
      { name: 'Skill Assessment & ROI Measurement', level: 75 }
    ],
    strengths: ['Dynamic presentation charisma', 'Empathetic coaching instincts', 'Translating complex corporate processes into actionable steps'],
    skillGaps: ['Blended microlearning design', 'LMS platform automation', 'Executive executive coaching certs (ICF)'],
    recommendedSkills: ['Facilitation & Public Speaking', 'Instructional Design Basics', 'Training Needs Assessment', 'PowerPoint / Canva Slide Design', 'LMS Administration'],
    dailyLife: [
      'Facilitating interactive multi-day onboarding workshops for new hires',
      'Conducting training needs assessments with department managers',
      'Designing practical role-play exercises, quizzes, and participant workbooks',
      'Tracking post-training employee productivity improvements'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9.5 – 17 LPA' },
      { level: 'Senior (5+ yr)', range: '₹17 – 28+ LPA' }
    ],
    pros: ['High corporate visibility and executive networking', 'Dynamic engaging work with diverse teams', 'Strong independent corporate coaching potential'],
    cons: ['Frequent travel for on-site corporate offsites and regional offices'],
    dayInLife: 'Delivering a morning communication and leadership module to 25 managers, reviewing participant feedback scores over lunch, and designing an e-learning module for next week.'
  },
  {
    id: 'instructional-designer',
    title: 'Instructional Designer',
    primaryCategory: 'EDU',
    secondaryCategories: ['UX', 'MED'],
    field: 'Education',
    salaryRange: '₹4.5 – 11 LPA',
    growth: 'High Demand',
    icon: 'BookOpen',
    overview: 'Design digital courses, interactive e-learning modules, video scripts, and curriculum structures for schools, universities, and EdTech apps.',
    requiredSkills: [
      { name: 'Instructional Models (ADDIE, Bloom\'s Taxonomy)', level: 90 },
      { name: 'Authoring Tools (Articulate Storyline, Rise)', level: 85 },
      { name: 'Storyboarding & Educational Scriptwriting', level: 85 },
      { name: 'Visual & Interactive Content Design', level: 80 },
      { name: 'Learning Management Systems (Canvas, Moodle)', level: 75 }
    ],
    strengths: ['Structuring complex knowledge clearly', 'Visual learning intuition', 'Cognitive load management', 'Educational creativity'],
    skillGaps: ['Gamified scenario branching logic', 'Video motion graphics integration', 'xAPI learning analytics'],
    recommendedSkills: ['ADDIE / Bloom\'s Taxonomy', 'Articulate 360 (Storyline / Rise)', 'Educational Storyboarding', 'Canva / Figma for Educators', 'LMS Fundamentals'],
    dailyLife: [
      'Collaborating with subject matter experts (SMEs) to extract core knowledge',
      'Writing detailed screen-by-screen course storyboards and quiz questions',
      'Building interactive self-paced modules in Articulate 360',
      'Reviewing learner retention rates and updating confusing sections'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9.5 – 16 LPA' },
      { level: 'Senior (5+ yr)', range: '₹16 – 26+ LPA' }
    ],
    pros: ['Combine teaching passion with modern technology and visual design', 'Massive remote work flexibility across global EdTech companies', 'Direct impact on thousands of online learners'],
    cons: ['Aligning difficult subject matter experts on simplified beginner explanations'],
    dayInLife: 'Interviewing a data science expert, writing the script and storyboard for a 10-minute animated module, and testing interactive quiz branch logic in Articulate Storyline.'
  },
  {
    id: 'edtech-specialist',
    title: 'EdTech Specialist / Product Educator',
    primaryCategory: 'EDU',
    secondaryCategories: ['SW', 'BM'],
    field: 'Education',
    salaryRange: '₹4.5 – 12 LPA',
    growth: 'High Demand',
    icon: 'Laptop',
    overview: 'Bridge technology and pedagogy by helping schools and companies implement, optimize, and train on educational software and digital learning tools.',
    requiredSkills: [
      { name: 'LMS & Educational Software Platforms', level: 85 },
      { name: 'EdTech Pedagogy & Blended Learning', level: 85 },
      { name: 'Teacher Training & Customer Success', level: 80 },
      { name: 'Student Engagement Analytics', level: 80 },
      { name: 'Digital Curriculum Integration', level: 75 }
    ],
    strengths: ['Passionate about modernizing education', 'Tech-savvy communication', 'Empathetic teacher onboarding', 'Process guidance'],
    skillGaps: ['AI-powered adaptive learning engines', 'Education data privacy laws', 'VR/AR classroom simulation tools'],
    recommendedSkills: ['LMS Administration (Moodle/Google Classroom)', 'EdTech Platform Demos', 'Customer Success & Training', 'Basic Data Analytics', 'Educational Technology Tools'],
    dailyLife: [
      'Onboarding schools and universities to new digital learning platforms',
      'Conducting live training webinars for teachers and college professors',
      'Analyzing student engagement metrics to identify drop-off points',
      'Providing feedback to product engineering teams on requested classroom features'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9.5 – 17 LPA' },
      { level: 'Senior (5+ yr)', range: '₹17 – 28+ LPA' }
    ],
    pros: ['Work in high-growth educational technology companies', 'Help transform outdated traditional education methods', 'Great balance of education mission and tech industry perks'],
    cons: ['Overcoming resistance from traditional educators reluctant to adopt new software'],
    dayInLife: 'Running a virtual workshop for 40 college faculty members on digital assessments, resolving platform integration tickets, and sharing teacher feedback with the product manager.'
  },

  // ==================== 11. RESEARCH (RES) ====================
  {
    id: 'research-analyst',
    title: 'Research Analyst',
    primaryCategory: 'RES',
    secondaryCategories: ['FIN', 'BM'],
    field: 'Research & Science',
    salaryRange: '₹4.5 – 11 LPA',
    growth: 'Steady Demand',
    icon: 'Search',
    overview: 'Investigate markets, industries, policies, or scientific domains, collecting data to write authoritative analytical reports and intelligence briefings.',
    requiredSkills: [
      { name: 'Primary & Secondary Research Methodologies', level: 90 },
      { name: 'Data Synthesis & Quantitative Analysis', level: 85 },
      { name: 'Comprehensive Technical / Market Report Writing', level: 90 },
      { name: 'Industry Benchmarking & Competitive Intelligence', level: 80 },
      { name: 'Critical Literature Evaluation', level: 85 }
    ],
    strengths: ['Deep intellectual curiosity', 'Unbiased investigative skepticism', 'Clear structured long-form writing', 'Pattern discernment'],
    skillGaps: ['Automated text mining and NLP', 'Econometric modeling', 'Expert interview cold-sourcing'],
    recommendedSkills: ['Secondary Research Techniques', 'Structured Analytical Writing', 'Excel Data Synthesis', 'Market Sizing Methodologies', 'Presentation & Whitepapers'],
    dailyLife: [
      'Scanning hundreds of industry publications, databases, and trade journals',
      'Conducting structured telephone interviews with industry experts',
      'Synthesizing disparate data points into structured market sizing models',
      'Writing multi-page research reports and executive intelligence summaries'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9.5 – 17 LPA' },
      { level: 'Senior (5+ yr)', range: '₹17 – 28+ LPA' }
    ],
    pros: ['Spend your days discovering new facts and learning about the world', 'Respected authority on complex topics', 'Strong career mobility into consulting, strategy, and think tanks'],
    cons: ['Requires reading heavy dense documents for hours without interruption'],
    dayInLife: 'Reviewing government regulatory filings on renewable energy, compiling market growth statistics into Excel, and writing the final section of a 20-page industry whitepaper.'
  },
  {
    id: 'research-scientist',
    title: 'Research Scientist',
    primaryCategory: 'RES',
    secondaryCategories: ['AI', 'EE'],
    field: 'Research & Science',
    salaryRange: '₹6 – 16 LPA',
    growth: 'High Demand',
    icon: 'Atom',
    overview: 'Formulate hypotheses, design controlled laboratory/computational experiments, discover novel scientific phenomena, and publish peer-reviewed papers.',
    requiredSkills: [
      { name: 'Scientific Method & Experimental Design', level: 95 },
      { name: 'Data Modeling & Statistical Significance', level: 85 },
      { name: 'Academic Publishing & Peer Review', level: 85 },
      { name: 'Laboratory Instrumentation / Computational Sim', level: 85 },
      { name: 'Grant Proposal Writing', level: 75 }
    ],
    strengths: ['Pure intellectual curiosity', 'Patience across multi-year experiments', 'Mathematical rigor', 'First-principles thinking'],
    skillGaps: ['Commercial patent filing', 'Translational research commercialization', 'Cross-institutional project leadership'],
    recommendedSkills: ['Experimental Design', 'Python/R for Statistical Analysis', 'Scientific Paper Writing (LaTeX)', 'Literature Synthesis', 'Grant Application Basics'],
    dailyLife: [
      'Formulating rigorous scientific hypotheses and testing frameworks',
      'Conducting laboratory bench tests or computational simulations',
      'Analyzing empirical data for statistical significance and anomalies',
      'Writing peer-reviewed journal papers and presenting at scientific conferences'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹5 – 8.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹8.5 – 15 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹15 – 26 LPA' },
      { level: 'Senior (5+ yr)', range: '₹26 – 45+ LPA' }
    ],
    pros: ['Push the boundaries of human knowledge and technology', 'High academic and global prestige', 'Intellectual freedom to pursue fundamental questions'],
    cons: ['Scientific experiments can fail repeatedly before yielding a breakthrough'],
    dayInLife: 'Reviewing simulation run outputs, discussing unexpected data anomalies with the lab team, preparing figures in LaTeX, and drafting a paper submission for a top journal.'
  },
  {
    id: 'rd-specialist',
    title: 'R&D Specialist (Research & Development)',
    primaryCategory: 'RES',
    secondaryCategories: ['EE', 'SW'],
    field: 'Research & Science',
    salaryRange: '₹5.5 – 14 LPA',
    growth: 'High Demand',
    icon: 'FlaskConical',
    overview: 'Bridge basic research and commercial products by building functional proof-of-concept prototypes, testing materials, and inventing new solutions.',
    requiredSkills: [
      { name: 'Rapid Proof-of-Concept Prototyping', level: 90 },
      { name: 'Applied Engineering & Testing', level: 85 },
      { name: 'Patent Research & IP Documentation', level: 80 },
      { name: 'Material / Algorithm Feasibility Analysis', level: 80 },
      { name: 'Cross-functional Technology Transfer', level: 75 }
    ],
    strengths: ['Applied inventive drive', 'Pragmatic tinkering instinct', 'Tolerance for experimental failure', 'Interdisciplinary curiosity'],
    skillGaps: ['Mass manufacturing design (DFM)', 'Regulatory product certification', 'Intellectual property strategy'],
    recommendedSkills: ['Rapid Prototyping Tools', 'Patent Search Methodologies', 'Experimental Validation', 'C/Python/MATLAB', 'Technical Documentation'],
    dailyLife: [
      'Building prototype iterations to test the feasibility of new technologies',
      'Running stress tests and thermal/computational benchmarks on prototypes',
      'Filing invention disclosure forms and patent applications',
      'Handing off validated proof-of-concepts to core product engineering teams'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹4.5 – 7 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹7 – 13 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹13 – 22 LPA' },
      { level: 'Senior (5+ yr)', range: '₹22 – 38+ LPA' }
    ],
    pros: ['Work on secret next-generation technologies years before public release', 'Great balance of scientific discovery and practical product engineering', 'Filing patents builds immense personal prestige'],
    cons: ['Many experimental prototypes get shelved if unit production costs are too high'],
    dayInLife: 'Benchmarking a new battery sensor prototype in the lab, analyzing heat dissipation logs, and collaborating with patent attorneys on an invention disclosure.'
  },

  // ==================== 12. LAW (LAW) ====================
  {
    id: 'legal-analyst',
    title: 'Legal Analyst',
    primaryCategory: 'LAW',
    secondaryCategories: ['RES', 'BM'],
    field: 'Legal',
    salaryRange: '₹4 – 10 LPA',
    growth: 'Steady Demand',
    icon: 'Scale',
    overview: 'Analyze contracts, review statutes and precedents, conduct legal due diligence, and assist corporate counsel and law firms with case preparation.',
    requiredSkills: [
      { name: 'Contract Review & Redlining', level: 85 },
      { name: 'Legal Research Databases (SCC Online, Manupatra)', level: 90 },
      { name: 'Case Law & Precedent Analysis', level: 85 },
      { name: 'Drafting Legal Memorandums & Briefs', level: 85 },
      { name: 'Due Diligence & Compliance Auditing', level: 80 }
    ],
    strengths: ['Rigorous logical argumentation', 'Attention to phrasing loopholes', 'Meticulous document analysis', 'Ethical principles'],
    skillGaps: ['Courtroom advocacy strategy', 'Cross-border international jurisdiction', 'Complex M&A agreement drafting'],
    recommendedSkills: ['SCC Online / Manupatra', 'Contract Drafting Basics', 'Legal Research Methodologies', 'Corporate Law Fundamentals', 'Legal Writing & Formatting'],
    dailyLife: [
      'Reviewing vendor agreements and NDAs for liability clauses',
      'Searching case law databases for landmark Supreme Court precedents',
      'Drafting legal research memos summarizing statutory requirements',
      'Organizing document rooms for corporate merger due diligence audits'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5 – 8.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹8.5 – 15 LPA' },
      { level: 'Senior (5+ yr)', range: '₹15 – 25+ LPA' }
    ],
    pros: ['Great foundational entry point into corporate law and legal tech', 'Develop razor-sharp analytical and logical reasoning skills', 'Applicable across corporate firms, tech startups, and litigation chambers'],
    cons: ['Reviewing hundreds of pages of dense contractual text requires high stamina'],
    dayInLife: 'Reviewing 5 customer software contracts for indemnity clauses, researching recent arbitration precedents on SCC Online, and drafting a legal opinion memo.'
  },
  {
    id: 'compliance-analyst',
    title: 'Compliance Analyst',
    primaryCategory: 'LAW',
    secondaryCategories: ['GOV', 'FIN'],
    field: 'Legal',
    salaryRange: '₹4.5 – 11 LPA',
    growth: 'High Demand',
    icon: 'FileCheck',
    overview: 'Ensure company policies and operations strictly obey government laws, financial regulations (SEBI, RBI), data protection acts, and industry ethics codes.',
    requiredSkills: [
      { name: 'Regulatory Frameworks (SEBI, RBI, Companies Act)', level: 85 },
      { name: 'Compliance Auditing & Gap Assessments', level: 85 },
      { name: 'Internal Policy Drafting & Enforcement', level: 80 },
      { name: 'Risk Mitigation & Whistleblower Procedures', level: 80 },
      { name: 'Statutory Filings & Reporting', level: 75 }
    ],
    strengths: ['Unyielding ethical integrity', 'Systematic audit discipline', 'Objective rule adherence', 'Diplomatic communication'],
    skillGaps: ['Anti-money laundering (AML) forensic monitoring', 'Data privacy compliance (DPDP Act)', 'International export controls'],
    recommendedSkills: ['Companies Act & SEBI Guidelines', 'Compliance Audit Checklists', 'Internal Policy Writing', 'Risk Assessment Matrices', 'Regulatory Filings'],
    dailyLife: [
      'Conducting quarterly compliance audits across company departments',
      'Updating internal code-of-conduct and data protection policies',
      'Investigating potential regulatory non-compliance alerts',
      'Filing mandatory periodic compliance certificates with regulators'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9.5 – 17 LPA' },
      { level: 'Senior (5+ yr)', range: '₹17 – 28+ LPA' }
    ],
    pros: ['Protect companies from massive regulatory fines and reputational destruction', 'High demand in fintech, banking, healthcare, and public companies', 'High stability and executive Chief Compliance Officer (CCO) pathway'],
    cons: ['Enforcing strict rules can sometimes face friction from fast-moving sales teams'],
    dayInLife: 'Auditing user consent logs for DPDP Act compliance, updating the company anti-bribery policy, and preparing quarterly compliance filings for the board of directors.'
  },
  {
    id: 'legal-researcher',
    title: 'Legal Researcher',
    primaryCategory: 'LAW',
    secondaryCategories: ['RES', 'GOV'],
    field: 'Legal',
    salaryRange: '₹4 – 10 LPA',
    growth: 'Steady Demand',
    icon: 'BookMarked',
    overview: 'Conduct in-depth scholarly and statutory research for senior advocates, judicial clerks, law commissions, and legal policy think tanks.',
    requiredSkills: [
      { name: 'Deep Statutory & Constitutional Research', level: 90 },
      { name: 'Comparative Legal Systems Analysis', level: 85 },
      { name: 'Case Law Synthesis & Citation Format', level: 90 },
      { name: 'Legal Argument Construction', level: 85 },
      { name: 'Policy Whitepaper Drafting', level: 80 }
    ],
    strengths: ['Scholarly academic patience', 'Nuanced logical reasoning', 'Clarity of legal language', 'Historical context recall'],
    skillGaps: ['Quantitative empirical legal studies', 'Drafting legislative amendment bills', 'Judicial impact assessment modeling'],
    recommendedSkills: ['Constitutional Law Fundamentals', 'Manupatra / SCC Online Mastery', 'Legal Argumentation Writing', 'Bluebook Citation Standards', 'Policy Analysis'],
    dailyLife: [
      'Dissecting constitutional law precedents and international jurisprudence',
      'Preparing exhaustive legal case background files for courtroom arguments',
      'Drafting policy research papers on emerging legal topics like AI ethics and privacy',
      'Organizing legal citations and legislative history chronologies'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3 – 5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5 – 8.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹8.5 – 15 LPA' },
      { level: 'Senior (5+ yr)', range: '₹15 – 24+ LPA' }
    ],
    pros: ['Spend your days solving intricate intellectual legal puzzles', 'Influence landmark court decisions and public law reform', 'Prepares you for judicial clerkships or academia'],
    cons: ['Heavy reading requirements with tight courtroom filing deadlines'],
    dayInLife: 'Researching 30 years of Supreme Court precedents on freedom of speech, drafting an argument outline for a Senior Advocate, and indexing legal authorities for a court petition.'
  },
  {
    id: 'corporate-lawyer',
    title: 'Corporate Lawyer / Legal Counsel',
    primaryCategory: 'LAW',
    secondaryCategories: ['BM', 'FIN'],
    field: 'Legal',
    salaryRange: '₹6 – 18 LPA',
    growth: 'High Demand',
    icon: 'Gavel',
    overview: 'Advise corporations on business mergers, joint ventures, funding rounds, intellectual property, and major commercial transactions.',
    requiredSkills: [
      { name: 'Commercial Contract Drafting & Negotiation', level: 90 },
      { name: 'Corporate Governance & Companies Act', level: 85 },
      { name: 'M&A and Venture Capital Deal Structuring', level: 85 },
      { name: 'Dispute Resolution & Risk Strategy', level: 80 },
      { name: 'Client Negotiation & Representation', level: 85 }
    ],
    strengths: ['Strategic commercial advocacy', 'High-stakes negotiation composure', 'Precise contract drafting', 'Business acumen'],
    skillGaps: ['Cross-border tax treaties', 'Antitrust competition defense', 'International arbitration procedures'],
    recommendedSkills: ['LLB / Law Degree', 'M&A Deal Documentation (SHA / SSA)', 'Contract Negotiation Tactics', 'Corporate Restructuring', 'Intellectual Property Basics'],
    dailyLife: [
      'Drafting Shareholders Agreements (SHA) and term sheets for funding rounds',
      'Leading intense negotiation calls with opposing corporate legal teams',
      'Advising executive leadership on legal risks in new product launches',
      'Managing trademark, patent, and commercial dispute proceedings'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹5 – 9 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹9 – 16 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹16 – 30 LPA' },
      { level: 'Senior (5+ yr)', range: '₹30 – 60+ LPA' }
    ],
    pros: ['One of the most lucrative and respected corporate professions', 'Direct involvement in multimillion-dollar business deals', 'Pathway to Law Firm Partner or Corporate General Counsel'],
    cons: ['Intense work hours during active merger and fundraising closing sprints'],
    dayInLife: 'Redlining a 50-page investment agreement, leading a negotiation call on founder indemnity clauses, and advising the CEO on a potential IP trademark risk.'
  },

  // ==================== 13. MEDIA & CREATIVE (MED) ====================
  {
    id: 'content-creator',
    title: 'Content Creator / Digital Producer',
    primaryCategory: 'MED',
    secondaryCategories: ['MKT', 'UX'],
    field: 'Media & Creative',
    salaryRange: '₹3.5 – 10 LPA',
    growth: 'Rapidly Growing',
    icon: 'Video',
    overview: 'Create entertaining, educational, and engaging digital content across YouTube, Instagram, LinkedIn, and podcasts to build an audience.',
    requiredSkills: [
      { name: 'Storytelling & Scriptwriting', level: 90 },
      { name: 'Video Shooting & Lighting', level: 80 },
      { name: 'Social Platform Algorithms (Reels/Shorts/YT)', level: 85 },
      { name: 'Audience Engagement & Community Building', level: 85 },
      { name: 'Basic Editing (Premiere / CapCut / Canva)', level: 80 }
    ],
    strengths: ['Charismatic creative expression', 'High digital trend sensitivity', 'Relentless creative output', 'Visual communication'],
    skillGaps: ['Monetization pipeline diversification', 'Long-form narrative structuring', 'Analytics retention curve optimization'],
    recommendedSkills: ['Scriptwriting & Hook Design', 'CapCut / Premiere Pro Basics', 'Camera & Audio Setup', 'Social Media Growth Strategies', 'Thumbnail & Visual Design'],
    dailyLife: [
      'Brainstorming video concepts and writing engaging script hooks',
      'Recording A-roll camera footage, voiceovers, and dynamic B-roll clips',
      'Editing pacing, adding captions, sound effects, and animations',
      'Engaging with community comments and tracking audience retention stats'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3 – 5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5 – 9 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9 – 16 LPA' },
      { level: 'Senior / Top Creator (5+ yr)', range: '₹16 – 35+ LPA + Brand Sponsorships' }
    ],
    pros: ['Total creative freedom to express your own personality and ideas', 'High monetization upside through sponsorships, courses, and products', 'Build an enduring personal brand that nobody can take away'],
    cons: ['Social platform algorithm volatility and relentless content creation pace'],
    dayInLife: 'Scripting 3 short-form video hooks in the morning, setting up studio lighting and filming, editing with fast captions in Premiere, and analyzing yesterday\'s YouTube retention drop-off.'
  },
  {
    id: 'video-editor',
    title: 'Video Editor / Motion Designer',
    primaryCategory: 'MED',
    secondaryCategories: ['UX', 'MKT'],
    field: 'Media & Creative',
    salaryRange: '₹3.5 – 9.5 LPA',
    growth: 'High Demand',
    icon: 'Film',
    overview: 'Turn raw footage into polished, cinematic videos, commercials, YouTube episodes, and social reels using pacing, color grading, and sound design.',
    requiredSkills: [
      { name: 'Adobe Premiere Pro / DaVinci Resolve', level: 90 },
      { name: 'Motion Graphics (After Effects)', level: 85 },
      { name: 'Sound Design & Audio Mixing', level: 80 },
      { name: 'Color Correction & Grading', level: 80 },
      { name: 'Story Pacing & Retention Editing', level: 85 }
    ],
    strengths: ['Visual rhythm and pacing sense', 'Cinematic aesthetic taste', 'Meticulous detail editing', 'Auditory-visual synchronization'],
    skillGaps: ['3D Motion design (Blender / Cinema 4D)', 'Complex visual effects (VFX) compositing', 'Batch rendering automation'],
    recommendedSkills: ['Premiere Pro / DaVinci Resolve', 'After Effects Motion Graphics', 'Audio Mixing & Sound Effects', 'Color Grading (LUTs)', 'Visual Storytelling Pacing'],
    dailyLife: [
      'Reviewing raw multi-camera footage and assembling rough story cuts',
      'Adding dynamic motion graphics, kinetic typography, and B-roll cutaways',
      'Fine-tuning audio levels, dialogue clarity, and background soundtrack swelling',
      'Color grading footage for consistent mood, tones, and contrast'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3 – 4.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹4.5 – 8 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹8 – 15 LPA' },
      { level: 'Senior (5+ yr)', range: '₹15 – 25+ LPA' }
    ],
    pros: ['High global freelance demand from creators, agencies, and brands', 'Pure visual craft with immediate rewarding results', 'High autonomy to work remotely with great equipment'],
    cons: ['Large video file rendering times and multiple rounds of client feedback revisions'],
    dayInLife: 'Cutting an 8-minute YouTube documentary in Premiere, designing custom animated charts in After Effects, mixing background sound effects, and exporting the 4K master file.'
  },
  {
    id: 'copywriter',
    title: 'Copywriter / Content Strategist',
    primaryCategory: 'MED',
    secondaryCategories: ['MKT', 'EDU'],
    field: 'Media & Creative',
    salaryRange: '₹3.5 – 9.5 LPA',
    growth: 'Steady Demand',
    icon: 'FileText',
    overview: 'Write high-converting ad copy, landing pages, email sequences, brand taglines, and thought leadership articles that persuade readers to take action.',
    requiredSkills: [
      { name: 'Persuasive Direct-Response Copywriting', level: 90 },
      { name: 'Headline & Hook Crafting', level: 90 },
      { name: 'Brand Voice & Tone Adaptation', level: 85 },
      { name: 'SEO Content Writing & Structuring', level: 80 },
      { name: 'Consumer Psychology & Motivation Triggers', level: 85 }
    ],
    strengths: ['Word precision and punchy phrasing', 'Empathy for customer pain points', 'Persuasive storytelling', 'Rapid ideation'],
    skillGaps: ['Conversion rate optimization (CRO) A/B copy testing', 'B2B whitepaper depth', 'Multi-channel brand messaging hierarchies'],
    recommendedSkills: ['Copywriting Frameworks (AIDA / PAS)', 'Headline Writing & Psychology', 'SEO Article Structuring', 'Email Copywriting', 'Portfolio Building'],
    dailyLife: [
      'Writing high-converting headlines and call-to-action buttons for landing pages',
      'Drafting persuasive email sequences and social media ad copy',
      'Researching customer reviews to discover exact words and pain points',
      'Refining articles for clarity, rhythm, active voice, and punchiness'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3 – 4.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹4.5 – 8 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹8 – 15 LPA' },
      { level: 'Senior (5+ yr)', range: '₹15 – 26+ LPA' }
    ],
    pros: ['The ability to sell and persuade with words is a timeless superpower', 'Massive remote work and international freelancing opportunities', 'Applicable across advertising, tech, entertainment, and e-commerce'],
    cons: ['Overcoming writer\'s block under tight client delivery deadlines'],
    dayInLife: 'Writing 10 headline variations for a new product landing page, drafting a 3-part onboarding email sequence, and polishing a thought leadership article for the CEO.'
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    primaryCategory: 'MED',
    secondaryCategories: ['UX', 'MKT'],
    field: 'Media & Creative',
    salaryRange: '₹3 – 8.5 LPA',
    growth: 'Steady Demand',
    icon: 'Image',
    overview: 'Create visual concepts, logos, posters, social media graphics, product packaging, and marketing collateral that communicate ideas effectively.',
    requiredSkills: [
      { name: 'Adobe Photoshop / Illustrator', level: 90 },
      { name: 'Visual Layout & Composition', level: 85 },
      { name: 'Typography & Color Theory', level: 85 },
      { name: 'Brand Identity & Logo Design', level: 80 },
      { name: 'Print & Digital Asset Preparation', level: 80 }
    ],
    strengths: ['Visual imagination', 'Color harmony sensitivity', 'Spatial composition balance', 'Creative versatility'],
    skillGaps: ['3D packaging visualization (Blender)', 'Vector animation', 'Automated template asset scaling'],
    recommendedSkills: ['Adobe Illustrator (Vector Design)', 'Adobe Photoshop (Photo Manipulation)', 'Canva / Figma Basics', 'Typography Principles', 'Print & Digital Specs'],
    dailyLife: [
      'Creating eye-catching social media creatives and promotional banners',
      'Designing logos, brand style guidelines, and color palettes',
      'Preparing print-ready packaging artwork and brochure layouts',
      'Retouching product photographs and compositing graphical elements'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹2.5 – 4 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹4 – 7 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹7 – 13 LPA' },
      { level: 'Senior (5+ yr)', range: '₹13 – 22+ LPA' }
    ],
    pros: ['Immediate visual satisfaction seeing your artwork in public and online', 'Versatile employment across advertising agencies, brands, and freelancing', 'Solid foundation for transition into UI/UX or Brand Strategy'],
    cons: ['Handling subjective client feedback like "make it pop" requires patience'],
    dayInLife: 'Illustrating a custom vector icon set in Illustrator, retouching hero product banners in Photoshop, and preparing social media post templates for the marketing team.'
  },
  {
    id: 'media-producer',
    title: 'Media Producer',
    primaryCategory: 'MED',
    secondaryCategories: ['BM', 'EDU'],
    field: 'Media & Creative',
    salaryRange: '₹4.5 – 12 LPA',
    growth: 'Growing',
    icon: 'Clapperboard',
    overview: 'Coordinate and oversee the complete lifecycle of video, audio, podcast, or film productions from budgeting and scheduling to final release.',
    requiredSkills: [
      { name: 'Production Planning & Budget Management', level: 85 },
      { name: 'Talent, Crew & Vendor Coordination', level: 85 },
      { name: 'Script Evaluation & Creative Direction', level: 80 },
      { name: 'Shoot Logistics & Equipment Scheduling', level: 85 },
      { name: 'Post-production Workflow Supervision', level: 80 }
    ],
    strengths: ['Organized creative leadership', 'Calm under production chaos', 'Budget and deadline discipline', 'Clear communication'],
    skillGaps: ['Virtual production studio technologies', 'Distribution rights licensing contracts', 'Multi-platform live broadcast switching'],
    recommendedSkills: ['Production Management', 'Script Breakdown & Budgeting', 'Audio/Video Production Workflows', 'Vendor & Crew Negotiation', 'Project Management Tools'],
    dailyLife: [
      'Scouting shoot locations and securing filming permissions',
      'Hiring cinematographers, sound recordists, and on-screen talent',
      'Managing production budgets, shoot schedules, and equipment rentals',
      'Supervising edit revisions with directors and corporate sponsors'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9.5 – 17 LPA' },
      { level: 'Senior (5+ yr)', range: '₹17 – 28+ LPA' }
    ],
    pros: ['Be the central orchestrator who brings large creative projects to life', 'Exciting dynamic days split between set locations and creative studios', 'Work with talented artists, directors, and creators'],
    cons: ['Unpredictable long shoot days and handling unexpected weather or gear issues'],
    dayInLife: 'Reviewing the call sheet for tomorrow\'s commercial video shoot, approving equipment rental invoices, directing the set crew on location, and reviewing the rough edit with the client.'
  },

  // ==================== 14. GOVERNMENT & PUBLIC SERVICE (GOV) ====================
  {
    id: 'policy-analyst',
    title: 'Policy Analyst',
    primaryCategory: 'GOV',
    secondaryCategories: ['RES', 'LAW'],
    field: 'Government & Public Service',
    salaryRange: '₹4.5 – 12 LPA',
    growth: 'Growing',
    icon: 'Landmark',
    overview: 'Research public challenges, evaluate government policy impacts, analyze socio-economic data, and draft proposals for government bodies and think tanks.',
    requiredSkills: [
      { name: 'Public Policy Formulation & Evaluation', level: 90 },
      { name: 'Socio-Economic Data Analysis', level: 85 },
      { name: 'Policy Brief & Whitepaper Drafting', level: 90 },
      { name: 'Stakeholder Consultation & Civic Feedback', level: 80 },
      { name: 'Governance & Legislative Frameworks', level: 85 }
    ],
    strengths: ['Civic impact dedication', 'Big-picture societal perspective', 'Analytical policy synthesis', 'Objective evaluation'],
    skillGaps: ['Econometric impact evaluation (Diff-in-Diff / RCTs)', 'Legislative drafting format', 'Public advocacy media strategy'],
    recommendedSkills: ['Public Policy Analysis Frameworks', 'Socio-Economic Data (Census / NSSO)', 'Policy Brief Writing', 'Cost-Benefit Analysis in Governance', 'Qualitative Civic Research'],
    dailyLife: [
      'Analyzing public datasets (NSSO, Census, NFHS) on education and health outcomes',
      'Drafting 2-page policy briefs for government ministers and department secretaries',
      'Facilitating roundtables with NGOs, civil society, and industry stakeholders',
      'Evaluating the effectiveness of existing government welfare schemes'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 6 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹6 – 10.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹10.5 – 18 LPA' },
      { level: 'Senior (5+ yr)', range: '₹18 – 30+ LPA' }
    ],
    pros: ['Profound scale of impact shaping government decisions that affect millions', 'Prestigious work with think tanks, NITI Aayog, and international bodies (UN, World Bank)', 'Deep intellectual satisfaction from solving systemic social issues'],
    cons: ['Government policy implementation cycles can be slow and bureaucratic'],
    dayInLife: 'Analyzing state-level rural skill development statistics, synthesizing international best practices into a policy draft, and meeting with government department officials.'
  },
  {
    id: 'public-administration-specialist',
    title: 'Public Administration Specialist',
    primaryCategory: 'GOV',
    secondaryCategories: ['BM', 'LAW'],
    field: 'Government & Public Service',
    salaryRange: '₹4 – 11 LPA',
    growth: 'Steady Demand',
    icon: 'Shield',
    overview: 'Manage public sector operations, government welfare programs, civic municipal services, and citizen grievance resolution systems.',
    requiredSkills: [
      { name: 'Public Administration & Civil Procedures', level: 85 },
      { name: 'Government Scheme Implementation & Monitoring', level: 85 },
      { name: 'Citizen Service Delivery & Grievance Redressal', level: 85 },
      { name: 'Public Procurement & Tendering (GeM Portal)', level: 80 },
      { name: 'Inter-departmental Coordination', level: 80 }
    ],
    strengths: ['Public service dedication', 'Orderly procedural adherence', 'Patience with diverse citizens', 'Administrative organization'],
    skillGaps: ['Digital e-governance platform automation', 'Public financial management systems (PFMS)', 'Urban civic infrastructure planning'],
    recommendedSkills: ['Public Administration Principles', 'GeM Portal & Procurement Rules', 'RTI Act & Administrative Law', 'Government Scheme Delivery', 'MS Office & E-Office Systems'],
    dailyLife: [
      'Overseeing the ground execution of state and central welfare schemes',
      'Resolving citizen service requests and Right to Information (RTI) queries',
      'Managing government procurement tenders on the GeM portal',
      'Coordinating with district magistrates and local municipal authorities'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3.5 – 5.5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5.5 – 9.5 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9.5 – 16 LPA' },
      { level: 'Senior (5+ yr)', range: '₹16 – 26+ LPA' }
    ],
    pros: ['Work directly for the welfare and betterment of public citizens', 'High societal respect and community recognition', 'Solid job stability and structured government promotion frameworks'],
    cons: ['Navigating complex government procedural hierarchies and red tape'],
    dayInLife: 'Reviewing district welfare distribution logs, holding a public hearing to address citizen complaints, inspecting a local public facility, and drafting the monthly administrative progress report.'
  },
  {
    id: 'civil-services-officer',
    title: 'Civil Services Officer (IAS / IPS / State PSC)',
    primaryCategory: 'GOV',
    secondaryCategories: ['LAW', 'BM'],
    field: 'Government & Public Service',
    salaryRange: '₹7 – 18 LPA + Govt Benefits',
    growth: 'High Prestige',
    icon: 'Award',
    overview: 'Lead district administration, law enforcement, public policy execution, and sovereign governance at the highest levels of the state and nation.',
    requiredSkills: [
      { name: 'Holistic General Knowledge & Constitutional Law', level: 95 },
      { name: 'Crisis Management & Public Order Leadership', level: 90 },
      { name: 'Public Policy Execution & Resource Allocation', level: 90 },
      { name: 'District Administration & Protocol Management', level: 90 },
      { name: 'Uncompromising Public Service Integrity', level: 95 }
    ],
    strengths: ['Supreme leadership authority', 'Patriotic duty and service ethics', 'Immense composure under political and public pressure', 'Holistic problem solving'],
    skillGaps: ['Digital government tech implementation', 'Public-private partnership (PPP) negotiations', 'Modern data-driven governance'],
    recommendedSkills: ['UPSC CSE / State PSC Syllabus', 'Indian Polity & Constitution', 'Ethics & Administrative Integrity', 'Public Administration', 'Essay Writing & Current Affairs'],
    dailyLife: [
      'Directing district-level developmental programs and infrastructure projects',
      'Chairs security, law-and-order, and disaster relief response committees',
      'Inspecting hospitals, schools, and civic infrastructure in rural and urban blocks',
      'Advising state cabinet ministers on statutory orders and administrative policies'
    ],
    salaryProgression: [
      { level: 'Sub-Divisional Magistrate (SDM 0-4 yr)', range: '₹7 – 10 LPA + Housing & Perks' },
      { level: 'District Magistrate / Collector (4-9 yr)', range: '₹10 – 15 LPA + State Benefits' },
      { level: 'Joint Secretary / Secretary (10+ yr)', range: '₹15 – 25+ LPA + Apex Governance Privileges' }
    ],
    pros: ['Unrivaled prestige, societal respect, and authority in Indian society', 'Direct sovereign power to transform millions of lives in entire districts', 'Lifelong job security, official residence, and constitutional protections'],
    cons: ['Extremely competitive entrance examination (UPSC / State PSCs) requiring intense preparation'],
    dayInLife: 'Reviewing district law and order with the police superintendent at 8 AM, chairing a rural road construction review, visiting a government health center, and reviewing files late into the evening.'
  },
  {
    id: 'public-sector-analyst',
    title: 'Public Sector Analyst (PSU / Banking)',
    primaryCategory: 'GOV',
    secondaryCategories: ['FIN', 'BM'],
    field: 'Government & Public Service',
    salaryRange: '₹5 – 13 LPA',
    growth: 'Steady Demand',
    icon: 'Building',
    overview: 'Perform operational, financial, and strategic analysis for Public Sector Undertakings (PSUs like ONGC, BHEL, NTPC) and nationalized banks.',
    requiredSkills: [
      { name: 'PSU Operations & Financial Management', level: 85 },
      { name: 'Public Procurement Rules (GFR)', level: 85 },
      { name: 'Data & Variance Analysis', level: 80 },
      { name: 'Auditing & Statutory Reporting', level: 80 },
      { name: 'Project Feasibility & Tendering', level: 75 }
    ],
    strengths: ['Financial stability focus', 'Rule-oriented execution', 'Thorough documentation', 'Collaborative teamwork'],
    skillGaps: ['Enterprise automation tools', 'Strategic commercial agility', 'Risk-adjusted capital planning'],
    recommendedSkills: ['GATE / Banking Exam Preparation', 'Public Procurement Guidelines (GFR)', 'Financial Analysis', 'Excel & MIS Reporting', 'Public Sector Governance'],
    dailyLife: [
      'Analyzing operational efficiency and fuel/resource costs across public plants',
      'Evaluating commercial tender bids for multi-crore public contracts',
      'Preparing monthly management information system (MIS) reports for directors',
      'Ensuring statutory compliance with government and audit guidelines'
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹4.5 – 7 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹7 – 11 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹11 – 18 LPA' },
      { level: 'Senior (5+ yr)', range: '₹18 – 28+ LPA' }
    ],
    pros: ['Excellent work-life balance and structured promotion ladders', 'Lucrative allowances, medical coverage, and housing in PSU townships', 'High stability and job security'],
    cons: ['Promotion is largely seniority-based rather than pure fast-track performance'],
    dayInLife: 'Reviewing vendor bids for a public equipment tender, verifying compliance with General Financial Rules (GFR), and preparing a financial feasibility report for the executive board.'
  }
];
