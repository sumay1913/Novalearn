import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import Course from "./models/Course.js";

const courses = [
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
  },

 
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
  },

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
});
