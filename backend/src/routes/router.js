const router = require("express").Router();

// Users routes

// router.use(require('./user'));

router.use(require("./course"));

router.use(require("./authentication"));

router.use(require("./user"));

router.use(require("./entries"));

// router.use(require("./institution"));

module.exports = router;
