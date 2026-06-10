import express from "express";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/student", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("enrollments.course");
    const enrolledIds = user.enrollments.map((item) => item.course?._id).filter(Boolean);
    const recommendations = await Course.find({
      published: true,
      _id: { $nin: enrolledIds }
    }).sort({ featured: -1, rating: -1 }).limit(3);

    res.json({
      enrollments: user.enrollments.filter((item) => item.course),
      recommendations,
      stats: {
        hoursLearned: 28,
        completed: user.enrollments.filter((item) => item.progress === 100).length,
        streak: user.streak,
        certificates: user.enrollments.filter((item) => item.progress === 100).length
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/enroll/:courseId", protect, async (req, res, next) => {
  try {
    if (req.user.enrollments.some((item) => item.course.equals(req.params.courseId))) {
      return res.status(409).json({ message: "Already enrolled in this course" });
    }
    req.user.enrollments.push({ course: req.params.courseId });
    await req.user.save();
    await Course.findByIdAndUpdate(req.params.courseId, { $inc: { studentCount: 1 } });
    res.status(201).json({ message: "Enrollment successful" });
  } catch (error) {
    next(error);
  }
});

router.patch("/progress/:courseId", protect, async (req, res, next) => {
  try {
    const enrollment = req.user.enrollments.find((item) => item.course.equals(req.params.courseId));
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    enrollment.progress = Math.min(100, Math.max(0, Number(req.body.progress)));
    enrollment.completedLessons = Number(req.body.completedLessons ?? enrollment.completedLessons);
    enrollment.lastAccessedAt = new Date();
    await req.user.save();
    res.json({ enrollment });
  } catch (error) {
    next(error);
  }
});

router.get("/admin", protect, adminOnly, async (_req, res, next) => {
  try {
    const [students, courses, published, enrollments] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments(),
      Course.countDocuments({ published: true }),
      User.aggregate([{ $unwind: "$enrollments" }, { $count: "total" }])
    ]);
    const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(5);
    res.json({
      stats: {
        students,
        courses,
        published,
        enrollments: enrollments[0]?.total || 0
      },
      recentCourses
    });
  } catch (error) {
    next(error);
  }
});

export default router;
