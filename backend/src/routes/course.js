const express = require("express");
const router = express.Router();

const course = require("../controllers/course.js");

router.get("/api/courses/:id", course.getCourseById);

router.get("/api/courses", course.getCourses);

router.post("/api/courses", course.newCourse);

router.delete("/courses/:id", course.deleteCourse);

router.put("/api/courses", course.updateCourse);

module.exports = router;
