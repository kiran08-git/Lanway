// Centralized mock data — replace with Supabase/AI calls later.

export const currentUser = {
  id: 'u1',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.com',
  avatarInitials: 'AS',
  college: 'Govt. Polytechnic College, Bhopal',
  course: 'Diploma in Computer Science',
  year: '2nd Year',
  city: 'Bhopal, Madhya Pradesh',
  tier: 'Tier-2',
  profileCompletion: 72,
  joinedOn: '2025-11-02',
};

export const assessmentProgress = {
  skillTest: { completed: true, score: 78 },
  aptitudeTest: { completed: true, score: 84 },
  interestTest: { completed: true, score: 91 },
  overallCompletion: 100,
};

export const skillRadar = [
  { skill: 'Logical Reasoning', value: 82 },
  { skill: 'Communication', value: 65 },
  { skill: 'Numerical Ability', value: 74 },
  { skill: 'Creativity', value: 70 },
  { skill: 'Technical Aptitude', value: 88 },
  { skill: 'Leadership', value: 58 },
];

export const careerMatches = [
  {
    id: 'c1',
    title: 'Full-Stack Web Developer',
    field: 'Technology',
    matchScore: 94,
    salaryRange: '₹4.5 – 12 LPA',
    growth: 'High Demand',
    icon: 'Code2',
    color: 'blue',
    tags: ['React', 'Node.js', 'Problem Solving'],
    description:
      'Design and build complete web applications — from user interfaces to backend logic and databases.',
  },
  {
    id: 'c2',
    title: 'Data Analyst',
    field: 'Technology',
    matchScore: 89,
    salaryRange: '₹4 – 10 LPA',
    growth: 'High Demand',
    icon: 'BarChart3',
    color: 'purple',
    tags: ['Excel', 'SQL', 'Python'],
    description:
      'Turn raw data into insights that help companies make better decisions using statistics and visualization.',
  },
  {
    id: 'c3',
    title: 'UI/UX Designer',
    field: 'Design',
    matchScore: 85,
    salaryRange: '₹3.5 – 9 LPA',
    growth: 'Growing',
    icon: 'PenTool',
    color: 'purple',
    tags: ['Figma', 'User Research', 'Prototyping'],
    description:
      'Craft intuitive, delightful digital experiences by understanding user needs and visual design principles.',
  },
  {
    id: 'c4',
    title: 'Digital Marketing Specialist',
    field: 'Business',
    matchScore: 79,
    salaryRange: '₹3 – 8 LPA',
    growth: 'Growing',
    icon: 'Megaphone',
    color: 'blue',
    tags: ['SEO', 'Content', 'Analytics'],
    description:
      'Plan and run campaigns across social, search, and content to help brands grow their audience online.',
  },
  {
    id: 'c5',
    title: 'Cloud Support Engineer',
    field: 'Technology',
    matchScore: 76,
    salaryRange: '₹4 – 9 LPA',
    growth: 'High Demand',
    icon: 'Cloud',
    color: 'blue',
    tags: ['AWS', 'Linux', 'Networking'],
    description:
      'Keep cloud infrastructure reliable and secure while helping teams deploy and scale their applications.',
  },
  {
    id: 'c6',
    title: 'Government Exam Aspirant (SSC/Banking)',
    field: 'Government',
    matchScore: 71,
    salaryRange: '₹3 – 7 LPA',
    growth: 'Stable',
    icon: 'Landmark',
    color: 'purple',
    tags: ['Reasoning', 'GK', 'Quant'],
    description:
      'Prepare for stable, respected government roles across banking, administration, and public sector exams.',
  },
];

export const careerDetails = {
  c1: {
    id: 'c1',
    title: 'Full-Stack Web Developer',
    field: 'Technology',
    matchScore: 94,
    icon: 'Code2',
    color: 'blue',
    overview:
      'Full-stack developers build both the parts of a website users see (frontend) and the systems that power it behind the scenes (backend). It is one of the most in-demand and accessible tech careers for students from any background, since it rewards self-taught skill as much as a formal degree.',
    dailyLife: [
      'Writing and debugging code for web features',
      'Collaborating with designers and product teams',
      'Testing applications and fixing bugs',
      'Reviewing code written by teammates',
    ],
    requiredSkills: [
      { name: 'HTML/CSS', level: 90 },
      { name: 'JavaScript', level: 80 },
      { name: 'React', level: 70 },
      { name: 'Node.js & APIs', level: 65 },
      { name: 'Databases (SQL)', level: 60 },
    ],
    education: [
      'Diploma/B.Tech in Computer Science, IT, or any stream + self-learning',
      'Free resources: freeCodeCamp, MDN Web Docs, YouTube',
      'Portfolio projects matter more than degree prestige',
    ],
    salaryProgression: [
      { level: 'Fresher (0-1 yr)', range: '₹3 – 5 LPA' },
      { level: 'Junior (1-3 yr)', range: '₹5 – 9 LPA' },
      { level: 'Mid (3-5 yr)', range: '₹9 – 16 LPA' },
      { level: 'Senior (5+ yr)', range: '₹16 – 30+ LPA' },
    ],
    pros: [
      'High demand across cities, including remote roles',
      'Skill-based hiring — projects matter more than pedigree',
      'Clear, fast learning path with free resources',
    ],
    cons: [
      'Requires continuous learning as tech evolves',
      'Can involve long focused screen-time',
      'Interview processes can be competitive',
    ],
    dayInLife:
      'A typical day mixes writing code in the morning, a short team stand-up call, reviewing a teammate\u2019s pull request, and testing a new feature before it goes live — with some time spent researching how to solve a tricky bug.',
  },
};

export const roadmapData = {
  c1: {
    careerId: 'c1',
    title: 'Full-Stack Web Developer Roadmap',
    totalDuration: '9–12 months',
    stages: [
      {
        id: 's1',
        phase: 'Foundation',
        duration: 'Month 1–2',
        status: 'completed',
        topics: ['HTML5 & semantic markup', 'CSS3, Flexbox & Grid', 'Git & GitHub basics'],
        resources: ['freeCodeCamp — Responsive Web Design', 'MDN Web Docs'],
      },
      {
        id: 's2',
        phase: 'Core Programming',
        duration: 'Month 2–4',
        status: 'in-progress',
        topics: ['JavaScript fundamentals', 'DOM manipulation', 'ES6+ features', 'Async JS & APIs'],
        resources: ['JavaScript.info', 'freeCodeCamp — JS Algorithms'],
      },
      {
        id: 's3',
        phase: 'Frontend Framework',
        duration: 'Month 4–6',
        status: 'locked',
        topics: ['React fundamentals', 'Hooks & state management', 'React Router', 'Tailwind CSS'],
        resources: ['React official docs', 'Scrimba React course'],
      },
      {
        id: 's4',
        phase: 'Backend & Databases',
        duration: 'Month 6–8',
        status: 'locked',
        topics: ['Node.js & Express', 'REST APIs', 'SQL & MongoDB basics', 'Authentication'],
        resources: ['Node.js docs', 'Supabase quickstart'],
      },
      {
        id: 's5',
        phase: 'Projects & Job Readiness',
        duration: 'Month 8–12',
        status: 'locked',
        topics: ['Build 3 portfolio projects', 'Resume & GitHub profile', 'Mock interviews & DSA basics'],
        resources: ['LeetCode (Easy set)', 'Pramp mock interviews'],
      },
    ],
  },
};

export const opportunities = [
  {
    id: 'o1',
    type: 'Internship',
    title: 'Frontend Developer Intern',
    org: 'Skillcircle Technologies',
    location: 'Remote',
    stipend: '₹8,000 – 15,000/mo',
    deadline: '2026-09-05',
    tags: ['React', 'Remote', 'Beginner Friendly'],
  },
  {
    id: 'o2',
    type: 'Scholarship',
    title: 'National Digital Skills Scholarship',
    org: 'Ministry of Skill Development',
    location: 'Pan India',
    stipend: 'Up to ₹50,000',
    deadline: '2026-09-20',
    tags: ['Tier-2/3 Students', 'Govt Scheme'],
  },
  {
    id: 'o3',
    type: 'Course',
    title: 'Full-Stack Development Certification',
    org: 'NSDC x Coursera',
    location: 'Online',
    stipend: 'Free',
    deadline: 'Rolling',
    tags: ['Certificate', 'Self-paced'],
  },
  {
    id: 'o4',
    type: 'Hackathon',
    title: 'Smart India Hackathon 2026',
    org: 'AICTE',
    location: 'Multiple Cities',
    stipend: 'Prizes up to ₹1,00,000',
    deadline: '2026-10-01',
    tags: ['Team Event', 'Build & Pitch'],
  },
  {
    id: 'o5',
    type: 'Internship',
    title: 'Data Analyst Intern',
    org: 'Insightful Analytics',
    location: 'Indore (Hybrid)',
    stipend: '₹10,000/mo',
    deadline: '2026-09-12',
    tags: ['SQL', 'Excel', 'Hybrid'],
  },
  {
    id: 'o6',
    type: 'Scholarship',
    title: 'Tier-2/3 Merit Scholarship',
    org: 'CareerAI Foundation',
    location: 'Pan India',
    stipend: 'Up to ₹25,000',
    deadline: '2026-09-30',
    tags: ['Merit Based', 'No Fee'],
  },
];

export const dashboardStats = [
  { label: 'Profile Completion', value: '72%', icon: 'UserCheck', color: 'blue' },
  { label: 'Assessments Done', value: '3/3', icon: 'ClipboardCheck', color: 'purple' },
  { label: 'Career Matches', value: '6', icon: 'Compass', color: 'blue' },
  { label: 'Saved Opportunities', value: '4', icon: 'Bookmark', color: 'purple' },
];

export const recentActivity = [
  { id: 1, text: 'Completed Aptitude Assessment', time: '2 days ago', icon: 'ClipboardCheck' },
  { id: 2, text: 'Viewed Full-Stack Developer roadmap', time: '3 days ago', icon: 'Map' },
  { id: 3, text: 'Saved "Frontend Developer Intern"', time: '5 days ago', icon: 'Bookmark' },
  { id: 4, text: 'Updated profile skills', time: '1 week ago', icon: 'UserCheck' },
];

export const assessmentQuestions = {
  skill: [
    {
      id: 'sk1',
      question: 'Which of these can you do comfortably?',
      options: ['Build a simple webpage with HTML/CSS', 'Write a basic Excel formula', 'Solve a Rubik\u2019s cube', 'None of these yet'],
    },
    {
      id: 'sk2',
      question: 'How comfortable are you with logical/mathematical problems?',
      options: ['Very comfortable', 'Somewhat comfortable', 'Need practice', 'Not comfortable'],
    },
    {
      id: 'sk3',
      question: 'Have you used any programming language before?',
      options: ['Yes, regularly', 'Yes, a little', 'Tried once or twice', 'Never'],
    },
  ],
  aptitude: [
    {
      id: 'ap1',
      question: 'If a train travels 60 km in 45 minutes, what is its speed in km/h?',
      options: ['70 km/h', '75 km/h', '80 km/h', '85 km/h'],
    },
    {
      id: 'ap2',
      question: 'Find the next number: 2, 6, 12, 20, 30, ?',
      options: ['36', '40', '42', '44'],
    },
    {
      id: 'ap3',
      question: 'Choose the odd one out',
      options: ['Circle', 'Square', 'Triangle', 'Sphere'],
    },
  ],
  interest: [
    {
      id: 'in1',
      question: 'Which activity excites you the most?',
      options: ['Building/fixing things', 'Designing visuals', 'Analyzing data & numbers', 'Talking & persuading people'],
    },
    {
      id: 'in2',
      question: 'In a group project, you naturally take the role of:',
      options: ['The planner/organizer', 'The researcher', 'The creative/designer', 'The presenter'],
    },
    {
      id: 'in3',
      question: 'Which subject did you enjoy most in school/college?',
      options: ['Computer Science/Maths', 'Art/Design', 'Commerce/Economics', 'Social Studies/Languages'],
    },
  ],
};
