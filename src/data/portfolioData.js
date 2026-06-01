// src/data/portfolioData.js

export const personalInfo = {
  name: "Ali Raza",
  title: "Full Stack Developer", // slanted Tag
  summary: "CS student building smart AI agents and mobile apps. Focused on clean code, robust architectures, and high-performance systems.",
  
  // Competencies shown in the About section floating cards
  competencies: {
    systemCore: {
      category: "System Core",
      title: "Creative Thinker",
      desc: "I design intuitive interfaces and AI agents that actually work. I focus on making complex interactions feel effortless.",
      skills: ["Python", "LangChain", "LLM Agents"]
    },
    engineSpecs: {
      category: "Engine Specs",
      title: "Full-Stack & Mobile",
      desc: "I bridge the gap between web and mobile. Skilled in Next.js, Flutter, and Python, with a deep focus on scalable data handling.",
      skills: ["Next.js", "Flutter", "Python", "Dart"]
    },
    opsDeployment: {
      category: "Ops & Deploy",
      title: "Swift & ML Specialist",
      desc: "Experienced in building native iOS applications and integrating on-device Machine Learning models that are highly optimized.",
      skills: ["Swift", "ML Models", "iOS Dev"]
    }
  }
};

export const projects = [
  {
    title: "VidAnswerAI",
    desc: "An AI-powered YouTube query engine. Fetches transcripts and vectors to answer questions in seconds. No more endless watching.",
    tech: ["Python", "LangChain", "Streamlit"],
    link: "https://github.com/aliraza174/VidAnswerAI"
  },
  {
    title: "Intelligent File Manager Agent",
    desc: "A conversational CLI tool. Using Groq Llama 3-70B, it lets you manage files and run commands just by talking to your terminal.",
    tech: ["Python", "LangChain", "LLM-Reasoning", "CLI"],
    link: "https://github.com/aliraza174/file-manager-agent"
  },
  {
    title: "AdFlow Pro",
    desc: "Production-grade sponsored listing marketplace. Features payments, moderation, and scheduling automations.",
    tech: ["Next.js", "Supabase", "PostgreSQL", "RBAC"],
    link: "https://github.com/aliraza174/addflow"
  },
  {
    title: "AI Fashion Stylist",
    desc: "ML-driven outfit generator. Merges imagery to create fresh fashion concepts.",
    tech: ["Swift", "Machine Learning", "Image Processing"],
    link: "https://github.com/aliraza174"
  }
];

export const contactInfo = {
  heading: "Let’s build something remarkable.",
  subtext: "Got a challenge or a project in mind? Let’s chat. I’m always down to talk tech or help turn a new idea into reality.",
  email: "mirzaaliraza9999@gmail.com",
  github: "https://github.com/aliraza174",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com"
};

export const skillsData = {
  languages: ["Swift (Internship Exp)", "Python", "C++", "Java", "JavaScript", "Dart (Flutter)"],
  tech: ["Next.js", "Flutter", "Supabase", "LangChain"],
  databases: ["MongoDB", "SQL", "NoSQL"]
};
