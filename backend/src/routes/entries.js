const express = require("express");
const router = express.Router();

const entries = require("../controllers/entries.js");

router.get("/api/entries/:id", entries.getEntrieById);

router.get("/api/entries/user/:id", entries.getEntriesByUserID);

router.get("/api/entries", entries.getEntries);

router.post("/api/entries", entries.newEntrie);

router.delete("/api/entries/:id", entries.deleteEntrie);

router.put("/api/entries", entries.updateEntrie);

module.exports = router;
