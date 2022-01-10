const express = require("express");
const router = express.Router();

const institution = require("../controllers/institution.js");

router.get("/api/institutions/:id", institution.getCourseById);

router.get("/api/institutions", institution.getCourses);

router.post("/api/institutions", institution.newCourse);

router.delete("/api/institutions/:id", institution.deleteCourse);

router.put("/api/institutions", institution.updateCourse);

module.exports = router;
