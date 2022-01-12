const express = require("express");
const router = express.Router();

const apiRoute = require("../controllers/apiRoute");

router.post("/api/register", apiRoute.register);

router.post("/api/login", apiRoute.login);

module.exports = router;
