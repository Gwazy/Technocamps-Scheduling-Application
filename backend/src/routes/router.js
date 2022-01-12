const router = require("express").Router();

// Users routes

// router.use(require('./user'));

router.use(require("./course"));

router.use(require("./apiRoutes"));

router.use(require("./user"));

// router.use(require("./institution"));

module.exports = router;
