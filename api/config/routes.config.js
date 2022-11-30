const express = require("express");
const createError = require("http-errors");
const {Target, Auth} = require('../routes');
const router = express.Router();


router.use('/', Auth);
router.use('/target', Target);

router.use((req, res, next) => next(createError(404, "Route not found")));

module.exports = router;