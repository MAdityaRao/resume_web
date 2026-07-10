export const profile = {
  name: "Aditya",
  role: "AI/ML Developer",
  tagline: "LLM Systems · Voice AI · Conversational Agents",
  location: "Udupi, Karnataka, India",
  email: "madityara5@gmail.com",
  github: "https://github.com/MAdityaRao",
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
    role: "Flagship — powers the agent on this page",
    stack: ["LiveKit Agents", "Cartesia STT/TTS", "GPT-4o-mini", "Next.js"],
    points: [
      "Real-time voice interviewer that answers strictly from a resume and an optional job description, held to sub-500ms round-trip latency.",
      "Accepts a job description live over a data channel and adapts its answers mid-conversation.",
      "Serverless token issuance, explicit agent dispatch on LiveKit Cloud, no persistent backend to manage.",
    ],
    link: "/project/project_readme/resume_agent",
    metric: "<500ms",
  },
  {
    id: "hotel-agent",
    name: "Hotel Booking Voice Automation Agent",
    role: "Independent build",
    stack: ["Python", "LiveKit", "OpenAI", "Google Sheets API"],
    points: [
      "Fully autonomous inbound call agent — greets guests, holds multi-turn conversation, captures structured booking data, confirms reservations with no human involvement.",
      "STT/TTS pipeline tuned over LiveKit WebRTC to stay under 500ms end-to-end; intent extraction held above 95% accuracy across test calls.",
      "Booking writes automated directly to Google Sheets, removing manual data entry.",
    ],
    link: "/project/project_readme/hotel_agent",
    metric: "95%+ accuracy",
  },
  {
    id: "insurance-agent",
    name: "Voice AI Insurance Assistant",
    role: "Independent build",
    stack: ["Python", "LiveKit Agents", "PostgreSQL", "Deepgram", "Cartesia", "Silero VAD"],
    points: [
      "Full STT → LLM → TTS call pipeline with natural conversational pacing through Silero VAD, handling inbound insurance customer queries.",
      "Normalised PostgreSQL schema across customers, policies, claims, and call logs; the agent pulls live caller data via asyncpg before each response.",
      "@function_tool pattern for mid-call database lookups triggered by phone number, removing manual policy verification.",
    ],
    link: "/project/project_readme/insurence_agent",
    metric: "0 manual verification",
  },
  {
    id: "arecanut",
    name: "Arecanut Price Forecasting",
    role: "Applied ML research",
    stack: ["Python", "TensorFlow", "ARIMA/SARIMA", "LSTM/GRU"],
    points: [
      "Time-series forecasting of wholesale arecanut prices across two grades, comparing classical and neural models against a naive persistence baseline.",
      "2,446 daily observations, 80/20 temporal split, 30-day sliding window evaluation.",
    ],
    link: "/project/project_readme/aracanut_lstm",
    metric: "5 models compared",
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
    id: "frontend-agent",
    name: "Frontend Code Agent",
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