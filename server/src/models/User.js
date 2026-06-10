import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const enrollmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    completedLessons: { type: Number, min: 0, default: 0 },
    lastAccessedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    avatar: { type: String, default: "" },
    learningGoal: { type: String, default: "Build future-ready skills" },
    streak: { type: Number, default: 0 },
    enrollments: [enrollmentSchema]
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
