const express = require("express");
const createError = require("http-errors");
const {User, Auth} = require('../routes');
const router = express.Router();


router.use('/', Auth);
router.use('/users', User);

router.use((req, res, next) => next(createError(404, "Route not found")));

module.exports = router;