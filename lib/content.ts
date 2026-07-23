export const profile = {
  name: "Aditya",
  role: "AI/ML Developer",
  tagline: "LLM Systems · Voice AI · Conversational Agents",
  location: "Udupi, Karnataka, India",
  email: "madityara5@gmail.com",
  github: "https://github.com/MAdityaRao",
  linkedin: "https://www.linkedin.com/in/aditya-rao-81832132b/",
  githubHandle: "MAdityaRao",
  quote: "I build AI systems that work in real environments, under real constraints.",
  stats: { repos: 14, followers: 3, following: 5 },
  currentFocus: [
    "Building production-grade LLM applications",
    "Improving RAG accuracy and retrieval quality",
    "Designing low-latency AI systems",
    "Tool-based agent architectures",
  ],
  summary:
    "Third year B.Sc Data Analytics student with real production experience building AI systems — from LLM-powered voice agents handling live inbound calls to automated data pipelines integrated with cloud infrastructure. Comfortable across the full stack: audio pipelines, LLM reasoning layers, database design, and cloud deployment. Focused on shipping things that work.",
};

export const experience = [
  {
    role: "AI Developer (Part-time)",
    org: "Torq Designs",
    location: "Karnataka",
    period: "Aug 2025 — Present",
    points: [
      "Designed and deployed 3+ production AI agents across voice, workflow, and LLM automation, replacing manual hotel reservation processes end-to-end for hospitality clients.",
      "Built real-time telephony pipelines combining live audio, LLM reasoning, and structured data capture, cutting per-booking handling time by roughly 80%.",
      "Maintained and scaled multi-agent AWS infrastructure with secure session handling, supporting simultaneous client deployments in production.",
    ],
  },
];

export type Project = {
  id: string;
  name: string;
  role: string;
  stack: string[];
  points: string[];
  link?: string;
  metric?: string;
};

export const projects: Project[] = [
  {
    id: "resume-agent",
    name: "Resume AI Voice Agent",
    role: "Conversational Interviewer",
    stack: ["LiveKit Agents", "Cartesia STT/TTS", "GPT-4o-mini", "Next.js"],
    points: [
      "Sub-500ms latency voice interface that adapts to job descriptions in real-time.",
      "Dynamic interview adaptation using live data channel updates.",
      "Serverless architecture for seamless agent dispatch and scaling.",
    ],
    link: "/project/project_readme/resume_agent",
    metric: "<500ms",
  },
  {
    id: "hotel-agent",
    name: "Hotel Booking Agent",
    role: "Autonomous Voice Assistant",
    stack: ["Python", "LiveKit", "OpenAI", "Google Sheets API"],
    points: [
      "Full-cycle autonomous booking agent handling reservations without human oversight.",
      "High-fidelity intent extraction with >95% accuracy.",
      "Automated data pipeline syncing bookings directly to Sheets.",
    ],
    link: "/project/project_readme/hotel_agent",
    metric: "95% Acc.",
  },
  {
    id: "insurance-agent",
    name: "Insurance AI Assistant",
    role: "Voice Query Engine",
    stack: ["Python", "LiveKit Agents", "PostgreSQL", "Deepgram", "Cartesia"],
    points: [
      "End-to-end voice pipeline optimized for natural insurance customer support.",
      "Real-time database lookups via asyncpg for instantaneous policy verification.",
      "Tool-calling architecture replacing manual verification workflows.",
    ],
    link: "/project/project_readme/insurence_agent",
    metric: "Automated",
  },
  {
    id: "arecanut",
    name: "Price Forecasting AI",
    role: "Predictive Analytics",
    stack: ["Python", "TensorFlow", "ARIMA/SARIMA", "LSTM/GRU"],
    points: [
      "Comparative time-series forecasting for volatile commodity markets.",
      "Rigorous evaluation against neural and statistical benchmarks.",
    ],
    link: "/project/project_readme/aracanut_lstm",
    metric: "5 Models",
  },
  {
    id: "nitk-library",
    name: "NITK Library Agent",
    role: "Research Agent",
    stack: ["Python", "LLM", "Agent"],
    points: ["Automated library inquiry system for NITK library."],
    link: "/project/project_readme/nitk_library_agent",
  },
  {
    id: "outbound-agent",
    name: "Outbound Calling Agent",
    role: "Voice Agent",
    stack: ["LiveKit", "Python"],
    points: ["Automated outbound calling system."],
    link: "/project/project_readme/outbound_agent",
  },
  {
    id: "agent-frontend-integration",
    name: "Agent–Frontend Integration",
    role: "Dev Tools",
    stack: ["TypeScript", "LLM"],
    points: ["Automated frontend code generator/helper."],
    link: "/project/project_readme/agent_frondend",
  },
];

export const skills = [
  {
    group: "AI / LLM",
    items: ["GPT-4", "Claude API", "LangGraph", "LangChain", "Prompt Engineering", "Multi-Turn Dialogue"],
  },
  {
    group: "Voice & Real-Time",
    items: ["LiveKit Agents", "WebRTC", "Deepgram STT", "Cartesia TTS", "Sarvam STT/TTS", "Silero VAD", "Plivo"],
  },
  {
    group: "Engineering",
    items: ["Python", "Flask", "FastAPI", "JavaScript", "REST APIs"],
  },
  {
    group: "Data & Databases",
    items: ["PostgreSQL", "asyncpg", "Pandas", "NumPy", "Scikit-learn", "SQL"],
  },
  {
    group: "Infrastructure",
    items: ["AWS — EC2, Lambda", "Git / GitHub", "Vercel", "Google Sheets API", "Docker"],
  },
];

export const education = {
  degree: "B.Sc in Data Analytics",
  school: "Dr. N.S.A.M. First Grade College, Nitte (Deemed to be University)",
  period: "2024 — 2027 (Expected)",
  coursework: [
    "Statistical Analysis",
    "Machine Learning",
    "Data Visualisation",
    "Python for Data Science",
    "Database Management",
  ],
};

export const repos = [
  { name: "arecanut_lstm", lang: "Jupyter Notebook", desc: "LSTM/ARIMA commodity price forecasting" },
  { name: "Resume_agent", lang: "Python", desc: "Real-time voice interview agent — the one on this page" },
  { name: "Resume_web", lang: "CSS", desc: "Earlier portfolio iteration" },
  { name: "torq_web_agent", lang: "Dockerfile", desc: "Voice agent infrastructure for Torq Designs" },
];