const express = require("express");
const router = express.Router();

const { createTokens, validateToken } = require("../JWT");

const authentication = require("../controllers/authentication");

router.post("/api/register", authentication.register);

router.post("/api/login", authentication.login);

router.post("/api/authCheck", validateToken, authentication.authCheck);

router.post("/api/logout", validateToken, authentication.logout);

module.exports = router;
