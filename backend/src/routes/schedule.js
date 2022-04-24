const express = require("express");
const router = express.Router();

const schedule = require("../controllers/schedule.js");

router.get("/api/schedules", schedule.getAllSchedule);

router.post("/api/schedules", schedule.newSchedule);

router.delete("/api/schedules/:id", schedule.deleteSchedule);

router.get("/api/schedules/autoschedule", schedule.autoSchedule);

module.exports = router;
