import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import Course from "./models/Course.js";

const courses = [
  {
    title: "AI Product Design",
    slug: "ai-product-design",
    description: "Design intelligent, human-centered products from first principles to polished prototypes.",
    category: "Design",
    level: "Intermediate",
    duration: "6 weeks",
    instructor: "Maya Chen",
    color: "#7c5cff",
    icon: "wand",
    rating: 4.9,
    studentCount: 2840,
    featured: true,
    skills: ["AI UX", "Prototyping", "Research"],
   lessons: [
  {
    title: "Designing with intelligence",
    duration: "18 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/3qHkcs3kG44"
  },
  {
    title: "AI interaction patterns",
    duration: "24 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/Oa9LTDR9ugU"
  },
  {
    title: "Prototype your copilot",
    duration: "45 min",
    type: "project",
    videoUrl: "https://www.youtube.com/embed/6mBO2vqLv38"
  },
  {
    title: "Trust and explainability",
    duration: "16 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/ad79nYk2keg"
  }
]
  },
  {
    title: "Generative AI Foundations",
    slug: "generative-ai-foundations",
    description: "Understand language models, prompting, embeddings, and the systems behind modern AI.",
    category: "Artificial Intelligence",
    level: "Beginner",
    duration: "8 weeks",
    instructor: "Alex Rivera",
    color: "#00a991",
    icon: "brain",
    rating: 4.8,
    studentCount: 4120,
    featured: true,
    skills: ["LLMs", "Prompting", "RAG"],
    lessons: [
  {
    title: "How generative AI works",
    duration: "22 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/G2fqAlgmoPo"
  },
  {
    title: "Prompt engineering studio",
    duration: "32 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/jZIXKlSJcrc"
  },
  {
    title: "Embeddings and search",
    duration: "28 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/aircAruvnKk"
  },
  {
    title: "Build a knowledge assistant",
    duration: "60 min",
    type: "project",
    videoUrl: "https://www.youtube.com/embed/7eh4d6sabA0"
  }
]
  },
  {
    title: "Full-Stack JavaScript",
    slug: "full-stack-javascript",
    description: "Ship production-ready applications with React, Node.js, APIs, and modern databases.",
    category: "Development",
    level: "Intermediate",
    duration: "10 weeks",
    instructor: "Jordan Lee",
    color: "#f08c46",
    icon: "code",
    rating: 4.9,
    studentCount: 3650,
    skills: ["React", "Node.js", "MongoDB"],
 lessons: [
  {
    title: "Modern React architecture",
    duration: "36 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8"
  },
  {
    title: "Express API design",
    duration: "30 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/SccSCuHhOw0"
  },
  {
    title: "Modeling with MongoDB",
    duration: "34 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/ofme2o29ngU"
  },
  {
    title: "Production deployment",
    duration: "25 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/l134cBAJCuc"
  }
]
  },
  {
    title: "Data Storytelling",
    slug: "data-storytelling",
    description: "Turn complex analysis into clear, persuasive narratives that move decisions forward.",
    category: "Data",
    level: "Beginner",
    duration: "5 weeks",
    instructor: "Priya Shah",
    color: "#e65d7b",
    icon: "chart",
    rating: 4.7,
    studentCount: 1920,
    skills: ["Visualization", "Narrative", "Analytics"],
  lessons: [
  {
    title: "Find the story in data",
    duration: "20 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/hVimVzgtD6w"
  },
  {
    title: "Visual hierarchy",
    duration: "25 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/TP2yID7Ubr4"
  },
  {
    title: "Present with confidence",
    duration: "18 min",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/Unzc731iCUY"
  }
]
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([User.deleteMany({}), Course.deleteMany({})]);

  const [admin, student] = await User.create([
    {
      name: "Ava Morgan",
      email: "admin@novalearn.dev",
      password: "admin123",
      role: "admin",
      streak: 12
    },
    {
      name: "Sam Wilson",
      email: "student@novalearn.dev",
      password: "student123",
      role: "student",
      streak: 7,
      learningGoal: "Become an AI product builder"
    }
  ]);

  const created = await Course.insertMany(courses.map((course) => ({ ...course, createdBy: admin._id })));
  student.enrollments = [
    { course: created[0]._id, progress: 68, completedLessons: 3 },
    { course: created[1]._id, progress: 32, completedLessons: 1 }
  ];
  await student.save();

  console.log("Seed complete");
  console.log("Admin: admin@novalearn.dev / admin123");
  console.log("Student: student@novalearn.dev / student123");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});         isme kha pr video url lgaayeee
