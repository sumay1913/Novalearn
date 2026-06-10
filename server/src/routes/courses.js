import express from "express";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();
const slugify = (value) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.all !== "true") filter.published = true;
    if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { skills: { $regex: req.query.search, $options: "i" } }
      ];
    }
    const courses = await Course.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ course });
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, adminOnly, async (req, res, next) => {
  try {
    const course = await Course.create({
      ...req.body,
      slug: `${slugify(req.body.title)}-${Date.now().toString().slice(-5)}`,
      createdBy: req.user._id
    });
    res.status(201).json({ course });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ course });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    await User.updateMany({}, { $pull: { enrollments: { course: course._id } } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
