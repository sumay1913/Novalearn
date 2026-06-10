export const demoCourses = [
  {
    _id: "course-1",
    title: "AI Product Design",
    slug: "ai-product-design",
    description: "Design intelligent, human-centered products from first principles to polished prototypes.",
    category: "Design",
    level: "Intermediate",
    duration: "6 weeks",
    instructor: "Maya Chen",
    color: "#7357e8",
    rating: 4.9,
    studentCount: 2840,
    skills: ["AI UX", "Prototyping", "Research"],
    featured: true,
    published: true,
    lessons: [
      { title: "Designing with intelligence", duration: "18 min", type: "video" },
      { title: "AI interaction patterns", duration: "24 min", type: "video" },
      { title: "Prototype your copilot", duration: "45 min", type: "project" },
      { title: "Trust and explainability", duration: "16 min", type: "article" }
    ]
  },
  {
    _id: "course-2",
    title: "Generative AI Foundations",
    slug: "generative-ai-foundations",
    description: "Understand language models, prompting, embeddings, and the systems behind modern AI.",
    category: "Artificial Intelligence",
    level: "Beginner",
    duration: "8 weeks",
    instructor: "Alex Rivera",
    color: "#008d7b",
    rating: 4.8,
    studentCount: 4120,
    skills: ["LLMs", "Prompting", "RAG"],
    featured: true,
    published: true,
    lessons: [
      { title: "How generative AI works", duration: "22 min", type: "video" },
      { title: "Prompt engineering studio", duration: "32 min", type: "video" },
      { title: "Embeddings and search", duration: "28 min", type: "article" },
      { title: "Build a knowledge assistant", duration: "60 min", type: "project" }
    ]
  },
  {
    _id: "course-3",
    title: "Full-Stack JavaScript",
    slug: "full-stack-javascript",
    description: "Ship production-ready applications with React, Node.js, APIs, and modern databases.",
    category: "Development",
    level: "Intermediate",
    duration: "10 weeks",
    instructor: "Jordan Lee",
    color: "#dc7430",
    rating: 4.9,
    studentCount: 3650,
    skills: ["React", "Node.js", "MongoDB"],
    published: true,
    lessons: [
      { title: "Modern React architecture", duration: "36 min", type: "video" },
      { title: "Express API design", duration: "30 min", type: "video" },
      { title: "Modeling with MongoDB", duration: "34 min", type: "article" }
    ]
  },
  {
    _id: "course-4",
    title: "Data Storytelling",
    slug: "data-storytelling",
    description: "Turn complex analysis into clear, persuasive narratives that move decisions forward.",
    category: "Data",
    level: "Beginner",
    duration: "5 weeks",
    instructor: "Priya Shah",
    color: "#d84f70",
    rating: 4.7,
    studentCount: 1920,
    skills: ["Visualization", "Narrative", "Analytics"],
    published: true,
    lessons: [
      { title: "Find the story in data", duration: "20 min", type: "video" },
      { title: "Visual hierarchy", duration: "25 min", type: "video" },
      { title: "Present with confidence", duration: "18 min", type: "project" }
    ]
  }
];

export const demoStudent = {
  enrollments: [
    { course: demoCourses[0], progress: 68, completedLessons: 3 },
    { course: demoCourses[1], progress: 32, completedLessons: 1 }
  ],
  recommendations: [demoCourses[2], demoCourses[3]],
  stats: { hoursLearned: 28, completed: 4, streak: 7, certificates: 3 }
};
