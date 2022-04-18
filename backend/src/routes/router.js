const router = require("express").Router();

// Users routes

router.use(require("./course"));

router.use(require("./authentication"));

router.use(require("./user"));

router.use(require("./entries"));

// External API routes

// router.use(require("./googlecalendar"));

module.exports = router;
