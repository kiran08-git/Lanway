import { CAREER_DATABASE, CATEGORY_INFO } from '../data/careerDatabase.js';
import { CATEGORY_NAMES } from './scoringEngine.js';

// Custom curated roadmaps for popular and diverse pathways
const CURATED_ROADMAPS = {
  'content-creator': {
    title: 'Content Creator & Digital Producer Roadmap',
    totalDuration: '4–6 months',
    difficulty: 'Beginner to Professional',
    overview: 'Master storytelling, short-form and long-form video production, audience psychology, and multi-platform monetization.',
    stages: [
      {
        id: 's1',
        phase: 'Storytelling & Ideation Fundamentals',
        duration: 'Month 1',
        objective: 'Learn scriptwriting hooks, narrative arcs, and audience psychology.',
        topics: [
          'The 3-Second Hook Rule & Retention Pacing',
          'Scriptwriting Frameworks for YouTube Shorts & Reels',
          'Niche Identification & Target Audience Persona Mapping',
          'Basic Visual Composition & Rule of Thirds'
        ],
        resources: [
          'HubSpot — Content Creation Crash Course (Free)',
          'YouTube Creator Academy — Algorithm & Audience Retention Guide',
          'Skillshare / YouTube — Scriptwriting for Digital Creators'
        ],
        milestoneProject: 'Write 10 short-form video scripts and record a 60-second pilot video.'
      },
      {
        id: 's2',
        phase: 'Production & Video Editing Tools',
        duration: 'Month 2–3',
        objective: 'Master mobile/desktop editing software, lighting setups, and audio clarity.',
        topics: [
          'CapCut & Adobe Premiere Pro / DaVinci Resolve Basics',
          'Microphone & Audio Equalization (Audacity / Descript)',
          'Lighting Setups: Key Light, Fill Light & RGB Backgrounds',
          'Dynamic Captions, B-Roll Sourcing & Sound Effects (SFX)'
        ],
        resources: [
          'DaVinci Resolve Official Training (Free certification)',
          'Filmora & Premiere Pro Crash Courses on YouTube',
          'CapCut Mobile & Desktop Masterclass'
        ],
        milestoneProject: 'Produce 5 polished short-form videos with custom captions, sound effects, and color grading.'
      },
      {
        id: 's3',
        phase: 'Growth Strategy, Analytics & Portfolio',
        duration: 'Month 4–5',
        objective: 'Scale views, analyze retention curves, and launch a content channel.',
        topics: [
          'Thumbnail Design Psychology (Canva / Photoshop)',
          'YouTube Studio & Instagram Professional Dashboard Analytics',
          'SEO for Video: Title, Descriptions, Tags & Hashtags',
          'Multi-channel Repurposing (YouTube, Instagram, LinkedIn, X)'
        ],
        resources: [
          'Canva Design School — Thumbnail Masterclass',
          'Social Media Examiner — Algorithm Growth Guides',
          'VidIQ / TubeBuddy Channel Optimization Tutorials'
        ],
        milestoneProject: 'Publish 15 videos consistently over 30 days and conduct an in-depth retention drop analysis.'
      },
      {
        id: 's4',
        phase: 'Monetization & Brand Partnerships',
        duration: 'Month 6+',
        objective: 'Pitch brand deals, create media kits, and monetize digital products.',
        topics: [
          'Media Kit Creation & Rate Card Structuring',
          'Inbound & Outbound Brand Pitching Templates',
          'Affiliate Marketing & Digital Product Launches (Gumroad/Notion)',
          'Community Building (Discord, Newsletter / Substack)'
        ],
        resources: [
          'Creator Economy Playbook by ConvertKit',
          'Substack Writers Resource Center',
          'Standard Sponsor Contract & Invoicing Templates'
        ],
        milestoneProject: 'Build a professional Media Kit portfolio and pitch 3 potential niche brand sponsors.'
      }
    ]
  },
  'video-editor': {
    title: 'Video Editor & Motion Designer Roadmap',
    totalDuration: '5–7 months',
    difficulty: 'Beginner to Industry-Ready',
    overview: 'Learn professional non-linear editing, motion graphics, audio mixing, and commercial color grading.',
    stages: [
      {
        id: 's1',
        phase: 'NLE Editing Fundamentals & Story Pacing',
        duration: 'Month 1–2',
        objective: 'Master timeline editing, cut types, rhythm, and keyboard shortcuts.',
        topics: [
          'Premiere Pro & DaVinci Resolve Interface & Hotkeys',
          'J-Cuts, L-Cuts, Jump Cuts & Match Cuts',
          'Audio Syncing, Dialogue Clean-up & Noise Reduction',
          'File Organization & Proxy Workflows for 4K Footage'
        ],
        resources: [
          'DaVinci Resolve Beginner Guide (Blackmagic Design Official)',
          'Premiere Pro Fundamentals on Coursera / YouTube',
          'Cinecom.net Editing Tutorials'
        ],
        milestoneProject: 'Edit a 3-minute raw documentary interview with B-roll cutaways and multi-track audio.'
      },
      {
        id: 's2',
        phase: 'Motion Graphics & Kinetic Typography',
        duration: 'Month 3–4',
        objective: 'Create animated titles, infographics, lower thirds, and transition effects.',
        topics: [
          'After Effects Keyframes, Graph Editor & Easy Ease',
          'Kinetic Typography & Social Media Subtitle Animation',
          'Masking, Rotoscoping & Green Screen Keying',
          'Shape Layers, Null Objects & Expression Basics'
        ],
        resources: [
          'School of Motion — Free After Effects Kickstart',
          'Ben Marriott Motion Graphics Tutorials on YouTube',
          'Adobe After Effects Official Classroom Guide'
        ],
        milestoneProject: 'Create a 30-second animated commercial explainer with dynamic motion graphics.'
      },
      {
        id: 's3',
        phase: 'Color Grading, Sound Design & Capstone',
        duration: 'Month 5–6',
        objective: 'Master cinematic color science and immersive soundscapes.',
        topics: [
          'Color Wheel, Scopes (Waveform, Vectorscope, Histogram)',
          'Color Correction vs Creative Grading (LUTs, Film Emulations)',
          'Layered Sound Design: Foley, Ambient Beds & Impact Whooshes',
          'Export Presets for YouTube, Broadcast & Social Formats'
        ],
        resources: [
          'Color Grading Central Tutorials',
          'Epidemic Sound / Artlist Sound Design Guides',
          'Blackmagic Certified Colorist Preparation'
        ],
        milestoneProject: 'Grade and sound-design a cinematic commercial showreel.'
      },
      {
        id: 's4',
        phase: 'Showreel, Freelancing & Client Work',
        duration: 'Month 7+',
        objective: 'Build a high-impact showreel, land freelance clients, or apply to agencies.',
        topics: [
          'Editing a 60-Second High-Energy Portfolio Showreel',
          'Freelance Platforms (Upwork, Fiverr Pro, Twitter/X outreach)',
          'Client Revision Management & Frame.io Workflows',
          'Contract Agreements, Deposits & Copyright Licensing'
        ],
        resources: [
          'Upwork Freelancer Readiness Guide',
          'Frame.io Video Review Platform Guide',
          'Showreel Breakdown Case Studies'
        ],
        milestoneProject: 'Publish a 60-second video editing showreel and apply to 5 remote agency gigs.'
      }
    ]
  },
  'digital-marketing-specialist': {
    title: 'Digital Marketing & Growth Specialist Roadmap',
    totalDuration: '5–8 months',
    difficulty: 'Beginner to Job-Ready',
    overview: 'Master search engine optimization, paid performance marketing, social media campaigns, and marketing analytics.',
    stages: [
      {
        id: 's1',
        phase: 'Marketing Foundations & Content Strategy',
        duration: 'Month 1–2',
        objective: 'Understand conversion funnels, buyer personas, and organic content marketing.',
        topics: [
          'AIDA & Customer Journey Funnels (Top, Middle, Bottom Funnel)',
          'Copywriting for Ads, Landing Pages & Email Subject Lines',
          'Keyword Research & Search Intent (Ahrefs / Ubersuggest)',
          'Social Media Strategy for B2C & B2B (Meta, LinkedIn, Instagram)'
        ],
        resources: [
          'HubSpot Academy — Inbound Marketing Certification (Free)',
          'Google Digital Garage — Fundamentals of Digital Marketing',
          'Copyhackers Free Copywriting Guides'
        ],
        milestoneProject: 'Create an end-to-end inbound content marketing strategy and 30-day editorial calendar for a brand.'
      },
      {
        id: 's2',
        phase: 'Search Engine Optimization (SEO) & Web Presence',
        duration: 'Month 3–4',
        objective: 'Drive organic traffic through on-page, off-page, and technical SEO.',
        topics: [
          'On-Page SEO (Title tags, Meta descriptions, H-tags, Schema)',
          'Technical SEO (Site speed, Crawlability, Core Web Vitals)',
          'Link Building Strategies & Digital PR Outreach',
          'Google Search Console & Google Analytics 4 (GA4) Setup'
        ],
        resources: [
          'Moz Beginner\'s Guide to SEO',
          'Semrush Academy SEO Certification (Free)',
          'Google Analytics 4 (GA4) Skillshop Certification'
        ],
        milestoneProject: 'Audit an existing website, fix on-page SEO issues, and write 3 high-ranking search articles.'
      },
      {
        id: 's3',
        phase: 'Performance Marketing & Paid Ads (PPC)',
        duration: 'Month 5–6',
        objective: 'Run profitable ad campaigns across Google Ads and Meta Ads Manager.',
        topics: [
          'Google Search Ads & Bidding Strategies (CPC, CPA, ROAS)',
          'Meta Ads Manager (Custom Audiences, Lookalike Audiences, Pixels)',
          'A/B Testing Ad Creatives & Landing Page Optimization',
          'Email Marketing Automation & Lead Nurturing (Mailchimp/Klaviyo)'
        ],
        resources: [
          'Google Ads Search Certification (Skillshop - Free)',
          'Meta Blueprint Certified Digital Marketing Associate',
          'CXL Institute Growth Marketing Blog'
        ],
        milestoneProject: 'Set up a mock or live ₹500 ad campaign with 3 A/B test variations and calculate CPA & ROAS.'
      },
      {
        id: 's4',
        phase: 'Marketing Analytics & Job Placement',
        duration: 'Month 7+',
        objective: 'Build executive reporting dashboards and prepare for agency/corporate marketing roles.',
        topics: [
          'Building Live Dashboards in Looker Studio (Google Data Studio)',
          'Attribution Modeling & Multi-touch Conversion Tracking',
          'Portfolio Case Study Presentation (Challenge -> Solution -> Metrics)',
          'Mock Interview Prep: Digital Marketing Manager / Growth Associate'
        ],
        resources: [
          'Google Looker Studio Official Tutorials',
          'GrowthHackers Community & Case Studies',
          'Digital Marketing Interview Questions & Frameworks'
        ],
        milestoneProject: 'Build a comprehensive Looker Studio marketing dashboard integrating GA4, Google Ads, and Meta data.'
      }
    ]
  },
  'data-analyst': {
    title: 'Data Analyst & BI Specialist Roadmap',
    totalDuration: '6–9 months',
    difficulty: 'Beginner to Job-Ready',
    overview: 'Master data querying with SQL, visual dashboarding with Power BI/Tableau, and statistical interpretation in Python/Excel.',
    stages: [
      {
        id: 's1',
        phase: 'Advanced Excel & Business Statistics',
        duration: 'Month 1–2',
        objective: 'Master structured numerical analysis, pivot tables, and core statistical metrics.',
        topics: [
          'Advanced Excel: XLOOKUP, INDEX/MATCH, Dynamic Arrays',
          'Pivot Tables, Calculated Fields & Slicers',
          'Descriptive Statistics (Mean, Median, Standard Deviation, Variance)',
          'Hypothesis Testing & Correlation vs Causation'
        ],
        resources: [
          'Chandoo.org Advanced Excel Guides',
          'Khan Academy — Statistics & Probability',
          'Microsoft Excel Specialist Free Tutorials'
        ],
        milestoneProject: 'Build an interactive financial/sales cohort analysis model in Excel with automated KPI summaries.'
      },
      {
        id: 's2',
        phase: 'Relational Databases & SQL Mastery',
        duration: 'Month 3–4',
        objective: 'Extract and transform data from relational database warehouses.',
        topics: [
          'SQL Basics: SELECT, WHERE, GROUP BY, HAVING, ORDER BY',
          'Multi-table JOINS (INNER, LEFT, RIGHT, FULL OUTER)',
          'Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LEAD/LAG)',
          'Common Table Expressions (CTEs) & Subqueries'
        ],
        resources: [
          'SQLBolt — Interactive SQL Lessons',
          'Mode Analytics — SQL for Data Analysis Tutorial',
          'LeetCode / HackerRank SQL Practice (50 Easy-Medium queries)'
        ],
        milestoneProject: 'Write a complex 10-query SQL analytical script solving real e-commerce churn and retention metrics.'
      },
      {
        id: 's3',
        phase: 'Business Intelligence: Power BI & Tableau',
        duration: 'Month 5–6',
        objective: 'Build executive decision-making dashboards and data storytelling models.',
        topics: [
          'Data Modeling & Star Schema Design',
          'DAX Formulas in Power BI (CALCULATE, FILTER, RELATED)',
          'Tableau Calculated Fields, Parameters & LOD Expressions',
          'Visual Best Practices & Executive KPI Card Hierarchy'
        ],
        resources: [
          'Microsoft Learn — Power BI Data Analyst (PL-300 Path)',
          'Tableau Public Free Training Videos',
          'Maven Analytics Dashboard Design Guide'
        ],
        milestoneProject: 'Publish an interactive multi-tab Power BI dashboard on Tableau Public or Power BI Service.'
      },
      {
        id: 's4',
        phase: 'Python for Data Analysis & Capstone Portfolio',
        duration: 'Month 7–9',
        objective: 'Clean messy data programmatically in Python (Pandas) and showcase a portfolio.',
        topics: [
          'Python Fundamentals: Lists, Dictionaries, Functions',
          'Pandas & NumPy: Data Cleaning, Merging & Grouping',
          'Data Visualization: Matplotlib & Seaborn',
          'GitHub Portfolio & Kaggle Case Studies for Resumes'
        ],
        resources: [
          'Kaggle — Python & Pandas Micro-courses (Free)',
          'freeCodeCamp — Data Analysis with Python Certification',
          'Alex The Analyst Portfolio Project YouTube Series'
        ],
        milestoneProject: 'Complete an end-to-end Kaggle dataset project: clean data in Python, store in SQL, visualize in Power BI, and write a LinkedIn case study.'
      }
    ]
  },
  'frontend-developer': {
    title: 'Frontend Web Developer Roadmap',
    totalDuration: '6–9 months',
    difficulty: 'Beginner to Industry-Ready',
    overview: 'Build reactive, high-performance web applications using modern HTML5, CSS3, JavaScript ES6+, React, and TypeScript.',
    stages: [
      {
        id: 's1',
        phase: 'Web Fundamentals & Modern CSS',
        duration: 'Month 1–2',
        objective: 'Master responsive layouts, semantic markup, and version control.',
        topics: [
          'HTML5 Semantic Elements, Forms & Accessibility (a11y)',
          'CSS3 Flexbox, CSS Grid & Responsive Media Queries',
          'Tailwind CSS Utility-First Framework',
          'Git Basics: Commit, Branch, Merge, Pull Requests on GitHub'
        ],
        resources: [
          'MDN Web Docs — Frontend Web Developer Path',
          'freeCodeCamp — Responsive Web Design Certification',
          'Tailwind CSS Official Documentation & Screencasts'
        ],
        milestoneProject: 'Build and deploy a responsive multi-page landing page to Vercel/Netlify with 100% mobile readiness.'
      },
      {
        id: 's2',
        phase: 'JavaScript Deep Dive & DOM APIs',
        duration: 'Month 3–4',
        objective: 'Master asynchronous JavaScript, modern ES6+ syntax, and API interactions.',
        topics: [
          'ES6+: Destructuring, Spread, Arrow Functions, Modules',
          'DOM Manipulation, Event Delegation & Custom Events',
          'Promises, Async/Await & Fetching RESTful APIs',
          'Local Storage, Session Storage & Browser DevTools Debugging'
        ],
        resources: [
          'JavaScript.info — Modern JavaScript Tutorial',
          'freeCodeCamp — JavaScript Algorithms and Data Structures',
          'Wes Bos — JavaScript30 (Free 30-day challenge)'
        ],
        milestoneProject: 'Build an interactive weather or movie search web app that fetches real-time REST API data.'
      },
      {
        id: 's3',
        phase: 'React.js & State Management',
        duration: 'Month 5–6',
        objective: 'Build modular single-page applications with hooks and reusable component systems.',
        topics: [
          'React Components, JSX, Props & State',
          'Hooks: useState, useEffect, useRef, useMemo, useCallback',
          'Client-Side Routing with React Router v6',
          'Global State: Zustand / Context API & Data Fetching with TanStack Query'
        ],
        resources: [
          'React Official Documentation (react.dev)',
          'Scrimba — Learn React for Free',
          'Josh Comeau — The Joy of React Guides'
        ],
        milestoneProject: 'Build an interactive E-Commerce Storefront with cart management, filters, and checkout simulation in React.'
      },
      {
        id: 's4',
        phase: 'TypeScript, Next.js & Job Preparation',
        duration: 'Month 7–9',
        objective: 'Type-safe production development, server-side rendering, and technical interviews.',
        topics: [
          'TypeScript Basics: Types, Interfaces, Generics in React',
          'Next.js App Router, Server Components & SEO Optimization',
          'Performance Profiling (Lighthouse, Web Vitals, Code Splitting)',
          'Frontend System Design & Mock Coding Interviews'
        ],
        resources: [
          'Total TypeScript Tutorials by Matt Pocock',
          'Next.js Official Learn Course',
          'GreatFrontEnd / BigFrontend Developer Interview Prep'
        ],
        milestoneProject: 'Build a production-ready Full-Stack Next.js portfolio application with authentication, database connection, and dark mode.'
      }
    ]
  },
  'ui-designer': {
    title: 'UI/UX & Product Designer Roadmap',
    totalDuration: '5–8 months',
    difficulty: 'Beginner to Industry-Ready',
    overview: 'Master design systems in Figma, user research, wireframing, interactive prototyping, and design-to-code handoff.',
    stages: [
      {
        id: 's1',
        phase: 'Visual Design Fundamentals & Figma Basics',
        duration: 'Month 1–2',
        objective: 'Understand visual hierarchy, typography, color theory, and Figma workflows.',
        topics: [
          'Visual Hierarchy, Contrast & Spacing Systems (8pt Grid)',
          'Typography Pairing & Digital Color Theory',
          'Figma Fundamentals: Vector Tools, Frames & Layers',
          'Auto Layout & Responsive Design Constraints'
        ],
        resources: [
          'Figma Official YouTube Tutorials',
          'Refactoring UI by Steve Schoger & Adam Wathan',
          'Google UX Design Certificate (Coursera)'
        ],
        milestoneProject: 'Design 3 clean mobile app screens in Figma utilizing 8pt grid and auto layout.'
      },
      {
        id: 's2',
        phase: 'Design Systems & Component Architecture',
        duration: 'Month 3–4',
        objective: 'Build reusable component libraries with variants and interactive states.',
        topics: [
          'Components, Variants & Component Properties in Figma',
          'Creating Design Tokens (Color, Typography, Spacing, Shadows)',
          'Form Design Best Practices & Micro-interactions',
          'Accessibility Guidelines (WCAG 2.1 AA Standards)'
        ],
        resources: [
          'Figma Design Systems Course',
          'Material Design 3 & Apple Human Interface Guidelines',
          'Nielsen Norman Group UX Articles'
        ],
        milestoneProject: 'Create a complete Mini-Design System with 15+ interactive UI components (Buttons, Modals, Inputs, Cards).'
      },
      {
        id: 's3',
        phase: 'User Research, Wireframing & Prototyping',
        duration: 'Month 5–6',
        objective: 'Conduct user interviews, map user flows, and build interactive clickable prototypes.',
        topics: [
          'User Personas, Empathy Maps & Journey Mapping',
          'Low-Fidelity Wireframing & Information Architecture',
          'Advanced Figma Prototyping (Smart Animate, Variables, Conditions)',
          'Usability Testing & Feedback Synthesis'
        ],
        resources: [
          'IDF (Interaction Design Foundation) Literature',
          'Miro UX Research Templates',
          'Figma Advanced Prototyping Tutorials'
        ],
        milestoneProject: 'Design an end-to-end mobile app prototype with user flow, clickable prototype, and usability test results.'
      },
      {
        id: 's4',
        phase: 'Case Study Portfolio & Industry Placement',
        duration: 'Month 7+',
        objective: 'Write in-depth product design case studies and prepare for design reviews.',
        topics: [
          'Writing Compelling UX Case Studies (Problem -> Process -> Result)',
          'Developer Handoff (Design Tokens, Specs & Redlines)',
          'Design Challenge Whiteboard Interviews',
          'Publishing Portfolio on Behance, Dribbble, or Custom Site'
        ],
        resources: [
          'Bestfolios.com Design Case Studies',
          'Figma to Code Plugins & Dev Mode Guide',
          'Design Interview Prep Handbook'
        ],
        milestoneProject: 'Publish 2 comprehensive product case studies on a personal portfolio website.'
      }
    ]
  }
};

/**
 * Dynamically generates a rich, 4-stage Learning Roadmap for ANY career role in CAREER_DATABASE.
 */
export function generateRoadmapForCareer(careerOrId) {
  let career = typeof careerOrId === 'string'
    ? CAREER_DATABASE.find((c) => c.id === careerOrId)
    : careerOrId;

  if (!career && typeof careerOrId === 'string') {
    // Attempt fuzzy match by title
    career = CAREER_DATABASE.find(
      (c) => c.title.toLowerCase().includes(careerOrId.toLowerCase()) || careerOrId.toLowerCase().includes(c.title.toLowerCase())
    );
  }

  if (!career) {
    career = CAREER_DATABASE[0]; // fallback to first career
  }

  // Check if a hand-curated roadmap exists for this career id
  if (CURATED_ROADMAPS[career.id]) {
    return {
      ...CURATED_ROADMAPS[career.id],
      careerId: career.id,
      careerTitle: career.title,
      field: career.field || 'General',
      primaryCategory: career.primaryCategory || 'SW',
      categoryName: CATEGORY_NAMES[career.primaryCategory] || 'Career Field',
      salaryRange: career.salaryRange || '₹4.5 – 12 LPA',
      growth: career.growth || 'High Demand',
    };
  }

  // Otherwise, synthesize a dynamic, highly accurate 4-stage roadmap using the career's database metadata!
  const categoryName = CATEGORY_NAMES[career.primaryCategory] || 'Professional Domain';
  const reqSkills = (career.requiredSkills || []).map((s) => s.name);
  const recSkills = career.recommendedSkills || [];
  const skillGaps = career.skillGaps || [];
  const strengths = career.strengths || [];

  const stage1Skills = reqSkills.slice(0, 3).length > 0 ? reqSkills.slice(0, 3) : ['Core Fundamentals', 'Domain Principles', 'Industry Terminology'];
  const stage2Skills = recSkills.slice(0, 3).length > 0 ? recSkills.slice(0, 3) : ['Practical Tools', 'Workflow Execution', 'Applied Frameworks'];
  const stage3Skills = skillGaps.slice(0, 3).length > 0 ? skillGaps.slice(0, 3) : ['Advanced Project Execution', 'Problem Solving', 'Real-world Edge Cases'];

  return {
    careerId: career.id,
    careerTitle: career.title,
    title: `${career.title} Learning Roadmap`,
    field: career.field || 'Industry Domain',
    primaryCategory: career.primaryCategory,
    categoryName,
    salaryRange: career.salaryRange || '₹4 – 12 LPA',
    growth: career.growth || 'Growing',
    totalDuration: '6–9 months',
    difficulty: 'Structured Learning Path',
    overview: career.overview || `A complete, step-by-step roadmap to become a certified and job-ready ${career.title}.`,
    stages: [
      {
        id: 's1',
        phase: 'Stage 1: Core Foundations & Prerequisite Knowledge',
        duration: 'Month 1–2',
        status: 'in-progress',
        objective: `Establish foundational knowledge in ${categoryName} and master essential concepts.`,
        topics: [
          ...stage1Skills.map((s) => `${s} — Core Concepts & Fundamentals`),
          `Industry Standards & Best Practice Workflows in ${categoryName}`,
          'Introduction to Standard Professional Tools & Environment Setup'
        ],
        resources: [
          `Free Introductory Guide to ${career.title}`,
          `Coursera / YouTube Foundation Course in ${categoryName}`,
          'Official Documentation & Industry Reference Guides'
        ],
        milestoneProject: `Complete a foundational starter project applying ${stage1Skills[0] || 'core concepts'}.`
      },
      {
        id: 's2',
        phase: 'Stage 2: Core Tooling, Frameworks & Practical Skills',
        duration: 'Month 3–4',
        status: 'locked',
        objective: `Build hands-on proficiency using modern industry software and execution frameworks.`,
        topics: [
          ...stage2Skills.map((s) => `${s} — Hands-on Implementation`),
          'Real-world Workflow Integration & Data Handling',
          'Collaboration, Documentation & Process Efficiency'
        ],
        resources: [
          `Practical Training Tutorials for ${stage2Skills[0] || 'Core Tools'}`,
          'Interactive Exercises & Guided Case Studies',
          'Industry Best Practice Checklists'
        ],
        milestoneProject: `Build a functional, practical project demonstrating proficiency in ${stage2Skills.slice(0, 2).join(' and ')}.`
      },
      {
        id: 's3',
        phase: 'Stage 3: Advanced Projects & Portfolio Building',
        duration: 'Month 5–6',
        status: 'locked',
        objective: `Bridge critical skill gaps, solve complex domain problems, and create portfolio assets.`,
        topics: [
          ...stage3Skills.map((s) => `Bridge: ${s}`),
          'End-to-End Case Study Development',
          'Quality Assurance, Optimization & Review Workflows'
        ],
        resources: [
          'Advanced Masterclasses & Industry Whitepapers',
          'Peer Review Communities & Open Repositories',
          'Portfolio Presentation & Case Study Blueprints'
        ],
        milestoneProject: `Complete a comprehensive capstone portfolio showcase solving an end-to-end ${career.title} challenge.`
      },
      {
        id: 's4',
        phase: 'Stage 4: Industry Readiness, Certifications & Placement',
        duration: 'Month 7+',
        status: 'locked',
        objective: `Prepare for interviews, earn recognized certifications, and target entry-level positions.`,
        topics: [
          `Target Industry Certifications for ${career.title}`,
          'Resume & LinkedIn Profile Optimization with Portfolio Showcase',
          'Mock Technical & Behavioral Interview Preparation',
          'Application Strategy for Internships, Junior Roles & Freelance Gigs'
        ],
        resources: [
          'Official Certification Study Guides',
          'Technical Interview Question Banks',
          'Resume & Cover Letter Templates for Entry-Level Candidates'
        ],
        milestoneProject: `Finalize your resume, polish your portfolio link, and apply to your first 5 target opportunities.`
      }
    ]
  };
}

/**
 * Returns all available categories and careers mapped cleanly for the roadmap selector.
 */
export function getAllCategoriesWithCareers() {
  const categoryMap = {};

  Object.entries(CATEGORY_INFO).forEach(([code, info]) => {
    categoryMap[code] = {
      code,
      name: info.name || CATEGORY_NAMES[code] || code,
      field: info.field || 'General',
      color: info.color || 'blue',
      careers: [],
    };
  });

  CAREER_DATABASE.forEach((career) => {
    const code = career.primaryCategory;
    if (categoryMap[code]) {
      categoryMap[code].careers.push(career);
    }
  });

  return categoryMap;
}
