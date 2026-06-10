import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: String, default: "12 min" },
    type: { type: String, enum: ["video", "article", "quiz", "project"], default: "video" }
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    duration: { type: String, default: "6 weeks" },
    instructor: { type: String, required: true },
    color: { type: String, default: "#7c5cff" },
    icon: { type: String, default: "sparkles" },
    rating: { type: Number, min: 0, max: 5, default: 4.8 },
    studentCount: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    skills: [{ type: String }],
    lessons: [lessonSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
