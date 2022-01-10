const express = require("express");
const router = express.Router();

const user = require("../controllers/user.js");

router.get("/api/users/:id", user.getCourseById);

router.get("/api/users", user.getCourses);

router.post("/api/users", user.newCourse);

router.delete("/api/users/:id", user.deleteCourse);

router.put("/api/users", user.updateCourse);

module.exports = router;
