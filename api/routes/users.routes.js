const express = require("express");
const router = express.Router();
const {users} = require('../controllers');

router.get("/:username", users.detail); 

module.exports = router;
